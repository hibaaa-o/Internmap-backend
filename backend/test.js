/**
 * Comprehensive API Test Suite for InternMap Backend
 * Tests authentication, internships, and applications modules
 */

const BASE_URL = 'http://localhost:5000';

// Test results tracking
let passed = 0;
let failed = 0;
const failures = [];

// Helper to make HTTP requests
async function request(method, endpoint, body = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(url, options);
    const data = res.ok ? await res.json() : await res.text();
    return { status: res.status, data, ok: res.ok };
  } catch (err) {
    return { status: 0, data: err.message, ok: false };
  }
}

// Test assertion helper
function assert(testName, condition, details = '') {
  if (condition) {
    console.log(`✅ ${testName}`);
    passed++;
  } else {
    console.log(`❌ ${testName}`);
    failed++;
    failures.push(`${testName}: ${details}`);
  }
}

// Main test suite
async function runTests() {
  console.log('\n🚀 Starting InternMap Backend Test Suite\n');

  // ============================================
  // 1. AUTHENTICATION TESTS
  // ============================================
  console.log('📋 === AUTHENTICATION TESTS ===\n');

  // Register user 1 (normal user)
  const reg1 = await request('POST', '/auth/register', {
    username: `testuser_${Date.now()}`,
    password: 'password123',
    role: 'user',
  });
  assert('Register normal user', reg1.ok && reg1.status === 201, reg1.data);
  let userToken = reg1.data?.token;
  let userId = reg1.data?.user?.id;

  // Register user 2 (admin user)
  const reg2 = await request('POST', '/auth/register', {
    username: `admin_${Date.now()}`,
    password: 'adminpass123',
    role: 'admin',
  });
  assert('Register admin user', reg2.ok && reg2.status === 201, reg2.data);
  let adminToken = reg2.data?.token;
  let adminId = reg2.data?.user?.id;

  // Register duplicate username (should fail)
  const regDup = await request('POST', '/auth/register', {
    username: reg1.data?.user?.username,
    password: 'different',
  });
  assert('Reject duplicate username', regDup.status === 409, regDup.data);

  // Login with valid credentials
  const login1 = await request('POST', '/auth/login', {
    username: reg1.data?.user?.username,
    password: 'password123',
  });
  assert('Login successful', login1.ok && login1.status === 200, login1.data);

  // Login with invalid password
  const loginFail = await request('POST', '/auth/login', {
    username: reg1.data?.user?.username,
    password: 'wrongpassword',
  });
  assert('Reject invalid password', loginFail.status === 401, loginFail.data);

  // ============================================
  // 2. INTERNSHIP TESTS
  // ============================================
  console.log('\n📋 === INTERNSHIP TESTS ===\n');

  // Create internship as admin
  const createIntern = await request(
    'POST',
    '/internships',
    {
      title: 'Frontend Developer Intern',
      company: 'TechCorp',
      description: 'Build responsive UI components',
      location: 'San Francisco',
      start_date: '2026-06-01',
      end_date: '2026-08-31',
    },
    adminToken
  );
  assert('Admin can create internship', createIntern.ok && createIntern.status === 201, createIntern.data);
  let internshipId = createIntern.data?.id;

  // Create internship as regular user (should fail)
  const createInternUser = await request(
    'POST',
    '/internships',
    {
      title: 'Should Fail',
      company: 'BadCorp',
    },
    userToken
  );
  assert('Non-admin cannot create internship', createInternUser.status === 403, createInternUser.data);

  // Get all internships (public)
  const getAllInterns = await request('GET', '/internships');
  assert('Public can fetch all internships', getAllInterns.ok && Array.isArray(getAllInterns.data), getAllInterns.data);

  // Get single internship (public)
  const getOneIntern = await request('GET', `/internships/${internshipId}`);
  assert('Public can fetch single internship', getOneIntern.ok && getOneIntern.data?.id === internshipId, getOneIntern.data);

  // Create second internship for later tests
  const createIntern2 = await request(
    'POST',
    '/internships',
    {
      title: 'Backend Developer Intern',
      company: 'DataSystems',
      description: 'Work on APIs',
      location: 'Remote',
    },
    adminToken
  );
  let internshipId2 = createIntern2.data?.id;

  // === Filtering/search tests ===
  // search by company
  const filterCompany = await request('GET', '/internships?company=TechCorp');
  assert('Filter internships by company', filterCompany.ok && filterCompany.data.every(i => i.company.includes('TechCorp')), filterCompany.data);

  // search by location (case insensitive)
  const filterLocation = await request('GET', '/internships?location=remote');
  assert('Filter internships by location', filterLocation.ok && filterLocation.data.every(i => i.location.toLowerCase().includes('remote')), filterLocation.data);

  // text query against title/description
  const filterText = await request('GET', '/internships?q=frontend');
  assert('Search internships with q parameter', filterText.ok && filterText.data.some(i => i.title.toLowerCase().includes('frontend') || (i.description && i.description.toLowerCase().includes('frontend'))), filterText.data);

  // date filtering
  const filterDate = await request('GET', "/internships?start_date=2026-01-01&end_date=2026-12-31");
  assert('Filter internships by date range', filterDate.ok && Array.isArray(filterDate.data), filterDate.data);


  // Update internship as admin
  const updateIntern = await request(
    'PUT',
    `/internships/${internshipId}`,
    {
      title: 'Senior Frontend Developer Intern',
      description: 'Build advanced UI systems',
    },
    adminToken
  );
  assert('Admin can update internship', updateIntern.ok && updateIntern.data?.title === 'Senior Frontend Developer Intern', updateIntern.data);

  // Delete internship as admin
  const createForDelete = await request(
    'POST',
    '/internships',
    {
      title: 'To Delete',
      company: 'DeleteCorp',
    },
    adminToken
  );
  const deleteInternId = createForDelete.data?.id;
  const deleteIntern = await request('DELETE', `/internships/${deleteInternId}`, null, adminToken);
  assert('Admin can delete internship', deleteIntern.ok, deleteIntern.data);

  // ============================================
  // 3. APPLICATION TESTS
  // ============================================
  console.log('\n📋 === APPLICATION TESTS ===\n');

  // Create application as regular user
  const createApp = await request(
    'POST',
    '/applications',
    {
      internship_id: internshipId,
      cover_letter: 'I am very interested in this position!',
    },
    userToken
  );
  assert('User can create application', createApp.ok && createApp.status === 201, createApp.data);
  let appId = createApp.data?.id;

  // Create application without authentication (should fail)
  const createAppNoAuth = await request('POST', '/applications', {
    internship_id: internshipId,
  });
  assert('Cannot create application without auth', createAppNoAuth.status === 401, createAppNoAuth.data);

  // Get applications as regular user (should only see own)
  const getUserApps = await request('GET', '/applications', null, userToken);
  assert('User can fetch own applications', getUserApps.ok && Array.isArray(getUserApps.data), getUserApps.data);
  assert('User sees only their applications', getUserApps.data?.some(a => a.id === appId), getUserApps.data);

  // Get applications as admin (should see all)
  const getAllApps = await request('GET', '/applications', null, adminToken);
  assert('Admin can fetch all applications', getAllApps.ok && Array.isArray(getAllApps.data), getAllApps.data);

  // Get single application as owner
  const getApp = await request('GET', `/applications/${appId}`, null, userToken);
  assert('User can view own application', getApp.ok && getApp.data?.id === appId, getApp.data);

  // Update application cover letter as owner
  const updateAppCover = await request(
    'PUT',
    `/applications/${appId}`,
    {
      cover_letter: 'Updated cover letter with more details!',
    },
    userToken
  );
  assert('User can update own application cover letter', updateAppCover.ok, updateAppCover.data);

  // Update application status as admin
  const updateAppStatus = await request(
    'PUT',
    `/applications/${appId}`,
    {
      status: 'accepted',
    },
    adminToken
  );
  assert('Admin can update application status', updateAppStatus.ok && updateAppStatus.data?.status === 'accepted', updateAppStatus.data);

  // Create another app, update as different user (should fail)
  const createApp2 = await request(
    'POST',
    '/applications',
    {
      internship_id: internshipId2,
      cover_letter: 'My application',
    },
    adminToken  // admin user creates
  );
  const appId2 = createApp2.data?.id;
  const updateAppAsWrongUser = await request(
    'PUT',
    `/applications/${appId2}`,
    {
      cover_letter: 'Hacked',
    },
    userToken  // different user tries to update
  );
  assert('User cannot update others application', updateAppAsWrongUser.status === 403, updateAppAsWrongUser.data);

  // Delete application as owner
  const deleteAppOwner = await request('DELETE', `/applications/${appId}`, null, userToken);
  assert('User can delete own application', deleteAppOwner.ok, deleteAppOwner.data);

  // Verify deleted application (should 404)
  const getDeletedApp = await request('GET', `/applications/${appId}`, null, userToken);
  assert('Cannot fetch deleted application', getDeletedApp.status === 404, getDeletedApp.data);

  // Admin can delete any application
  const deleteAppAdmin = await request('DELETE', `/applications/${appId2}`, null, adminToken);
  assert('Admin can delete any application', deleteAppAdmin.ok, deleteAppAdmin.data);

  // ============================================
  // 4. PROTECTED ROUTES TEST
  // ============================================
  console.log('\n📋 === PROTECTED ROUTES TEST ===\n');

  // Access /admin with token
  const adminRoute = await request('GET', '/admin', null, adminToken);
  assert('Admin can access /admin route', adminRoute.ok && adminRoute.status === 200, adminRoute.data);

  // Access /admin as regular user (should fail)
  const adminRouteFail = await request('GET', '/admin', null, userToken);
  assert('Non-admin cannot access /admin route', adminRouteFail.status === 403, adminRouteFail.data);

  // Access /admin without token (should fail)
  const adminRouteNoAuth = await request('GET', '/admin');
  assert('Cannot access /admin without token', adminRouteNoAuth.status === 401, adminRouteNoAuth.data);

  // --- Admin dashboard stats ---
  const stats = await request('GET', '/admin/stats', null, adminToken);
  assert('Admin can query stats endpoint', stats.ok && stats.status === 200 && typeof stats.data.users === 'number', stats.data);
  assert('Stats response contains internship count', typeof stats.data.internships === 'number', stats.data);
  assert('Stats response contains application count', typeof stats.data.applications === 'number', stats.data);
  assert('Stats response contains applicationsByStatus array', Array.isArray(stats.data.applicationsByStatus), stats.data);

  // Stats endpoint forbidden for regular user
  const statsForUser = await request('GET', '/admin/stats', null, userToken);
  assert('Non-admin cannot access stats', statsForUser.status === 403, statsForUser.data);
  

  // ============================================
  // RESULTS
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 TEST RESULTS\n`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${passed + failed}`);
  console.log(`🎯 Success Rate: ${(passed / (passed + failed) * 100).toFixed(1)}%\n`);

  if (failures.length > 0) {
    console.log('💥 FAILURES:');
    failures.forEach(f => console.log(`  - ${f}`));
  }

  console.log('='.repeat(50));

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  console.error('💥 Test suite error:', err);
  process.exit(1);
});
