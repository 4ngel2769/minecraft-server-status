/**
 * Test Script for Minecraft Server Status Checker
 * Runs automated tests against known servers
 */

const servers = [
  {
    name: 'Hypixel',
    hostname: 'mc.hypixel.net',
    expectedOnline: true,
    type: 'java',
  },
  {
    name: '2b2t',
    hostname: '2b2t.org',
    expectedOnline: true,
    type: 'java',
  },
  {
    name: 'Mineplex US',
    hostname: 'us.mineplex.com',
    expectedOnline: true,
    type: 'java',
  },
  {
    name: 'The Hive (Bedrock)',
    hostname: 'hivebedrock.network',
    port: 19132,
    expectedOnline: true,
    type: 'bedrock',
  },
  {
    name: 'Invalid Server (Should Fail)',
    hostname: 'this-server-definitely-does-not-exist-12345.com',
    expectedOnline: false,
    type: 'java',
  },
  {
    name: 'Localhost (May Fail)',
    hostname: 'localhost',
    expectedOnline: false, // Usually no server running locally
    type: 'java',
  },
];

async function testServer(server) {
  const url = `http://localhost:3000/api/server?hostname=${server.hostname}${
    server.port ? `&port=${server.port}` : ''
  }`;

  console.log(`\n🧪 Testing: ${server.name}`);
  console.log(`   URL: ${server.hostname}${server.port ? `:${server.port}` : ''}`);

  const startTime = Date.now();
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`   Status: ${response.status}`);
    console.log(`   Duration: ${duration}ms`);

    if (response.ok) {
      console.log(`   ✅ Server Online`);
      console.log(`   Players: ${data.players?.online || 0}/${data.players?.max || 0}`);
      console.log(`   Version: ${data.version?.name || 'Unknown'}`);
      console.log(`   MOTD: ${data.motd?.clean?.[0] || 'No MOTD'}`);
      
      if (!server.expectedOnline) {
        console.log(`   ⚠️  WARNING: Expected offline but got online`);
      }
    } else {
      console.log(`   ❌ Request Failed`);
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      
      if (server.expectedOnline) {
        console.log(`   ⚠️  WARNING: Expected online but got error`);
      }
    }

    return {
      server: server.name,
      success: response.ok,
      duration,
      expectedOnline: server.expectedOnline,
      actualOnline: response.ok,
    };
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`   ❌ Error: ${error.message}`);
    console.log(`   Duration: ${duration}ms`);
    
    if (server.expectedOnline) {
      console.log(`   ⚠️  WARNING: Expected online but got error`);
    }

    return {
      server: server.name,
      success: false,
      duration,
      error: error.message,
      expectedOnline: server.expectedOnline,
      actualOnline: false,
    };
  }
}

async function runTests() {
  console.log('🚀 Starting Server Tests...');
  console.log('Testing against http://localhost:3000');
  console.log('═══════════════════════════════════════\n');

  const results = [];
  
  for (const server of servers) {
    const result = await testServer(server);
    results.push(result);
    
    // Wait 2 seconds between requests to avoid rate limiting
    if (servers.indexOf(server) < servers.length - 1) {
      console.log('\n⏳ Waiting 2s before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n\n═══════════════════════════════════════');
  console.log('📊 Test Summary');
  console.log('═══════════════════════════════════════\n');

  const passed = results.filter(r => r.success === r.expectedOnline).length;
  const failed = results.filter(r => r.success !== r.expectedOnline).length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Average Response Time: ${avgDuration.toFixed(0)}ms`);
  console.log(`Min Response Time: ${Math.min(...results.map(r => r.duration))}ms`);
  console.log(`Max Response Time: ${Math.max(...results.map(r => r.duration))}ms`);

  console.log('\n📋 Detailed Results:\n');
  results.forEach((result, index) => {
    const status = result.success === result.expectedOnline ? '✅' : '❌';
    console.log(`${status} ${result.server}`);
    console.log(`   Expected: ${result.expectedOnline ? 'Online' : 'Offline'}, Got: ${result.actualOnline ? 'Online' : 'Offline'}`);
    console.log(`   Duration: ${result.duration}ms`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  });

  console.log('═══════════════════════════════════════');
  console.log(failed === 0 ? '🎉 All tests passed!' : '⚠️  Some tests failed');
  console.log('═══════════════════════════════════════\n');
}

// Check if server is running
async function checkServerRunning() {
  try {
    const response = await fetch('http://localhost:3000');
    return response.ok;
  } catch {
    return false;
  }
}

// Main execution
(async () => {
  const isRunning = await checkServerRunning();
  
  if (!isRunning) {
    console.error('❌ Error: Development server is not running!');
    console.error('Please start the server with: npm run dev');
    process.exit(1);
  }

  await runTests();
})();
