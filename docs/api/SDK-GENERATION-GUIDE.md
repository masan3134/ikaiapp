# SDK Generation Guide

**Version:** 1.0.0
**Last Updated:** 2025-11-04
**OpenAPI Spec:** `openapi.json`

---

## 🎯 Overview

This guide explains how to generate client SDKs for the IKAI API using OpenAPI Generator.

**Supported Languages:**
- ✅ JavaScript/TypeScript
- ✅ Python
- ✅ Java
- ✅ C#
- ✅ Go
- ✅ PHP
- ✅ Ruby

---

## 📦 Prerequisites

### Install OpenAPI Generator

**Option 1: npm**
```bash
npm install @openapitools/openapi-generator-cli -g
```

**Option 2: Homebrew (macOS)**
```bash
brew install openapi-generator
```

**Option 3: Docker**
```bash
docker pull openapitools/openapi-generator-cli
```

---

## 🔨 Generation Commands

### JavaScript/TypeScript Client

#### TypeScript (Axios)
```bash
openapi-generator-cli generate \
  -i docs/api/openapi.json \
  -g typescript-axios \
  -o sdks/typescript \
  --additional-properties=npmName=ikai-api-client,npmVersion=1.0.0,supportsES6=true
```

**Output:** `sdks/typescript/`

**Usage:**
```typescript
import { Configuration, AuthenticationApi, JobPostingsApi } from 'ikai-api-client';

// Configure API client
const config = new Configuration({
  basePath: 'http://localhost:8102',
  accessToken: 'your-jwt-token'
});

// Use API
const authApi = new AuthenticationApi(config);
const jobsApi = new JobPostingsApi(config);

// Login
const loginResponse = await authApi.apiV1AuthLoginPost({
  email: 'test-admin@test-org-1.com',
  password: 'TestPass123!'
});

const token = loginResponse.data.token;

// Get job postings
const jobs = await jobsApi.apiV1JobPostingsGet();
console.log(jobs.data);
```

---

#### JavaScript (Node.js)
```bash
openapi-generator-cli generate \
  -i docs/api/openapi.json \
  -g javascript \
  -o sdks/javascript \
  --additional-properties=projectName=ikai-api-client,projectVersion=1.0.0,usePromises=true
```

**Usage:**
```javascript
const IkaiApi = require('ikai-api-client');

const client = new IkaiApi.ApiClient();
client.basePath = 'http://localhost:8102';
client.authentications['bearerAuth'].accessToken = 'your-jwt-token';

const authApi = new IkaiApi.AuthenticationApi(client);

authApi.apiV1AuthLoginPost({
  email: 'test-admin@test-org-1.com',
  password: 'TestPass123!'
}, (error, data) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Token:', data.token);
  }
});
```

---

### Python Client

```bash
openapi-generator-cli generate \
  -i docs/api/openapi.json \
  -g python \
  -o sdks/python \
  --additional-properties=packageName=ikai_api,projectName=ikai-api-client,packageVersion=1.0.0
```

**Output:** `sdks/python/`

**Install:**
```bash
cd sdks/python
pip install -e .
```

**Usage:**
```python
import ikai_api
from ikai_api.rest import ApiException

# Configure API client
configuration = ikai_api.Configuration(
    host = "http://localhost:8102"
)

# Login
with ikai_api.ApiClient(configuration) as api_client:
    auth_api = ikai_api.AuthenticationApi(api_client)

    try:
        # Login
        login_request = ikai_api.LoginRequest(
            email="test-admin@test-org-1.com",
            password="TestPass123!"
        )
        login_response = auth_api.api_v1_auth_login_post(login_request)
        token = login_response.token
        print(f"Token: {token}")

        # Configure with token
        configuration.access_token = token

        # Get job postings
        jobs_api = ikai_api.JobPostingsApi(api_client)
        jobs = jobs_api.api_v1_job_postings_get()
        print(f"Found {len(jobs)} job postings")

    except ApiException as e:
        print(f"Exception: {e}")
```

---

### Java Client

```bash
openapi-generator-cli generate \
  -i docs/api/openapi.json \
  -g java \
  -o sdks/java \
  --additional-properties=groupId=com.ikai,artifactId=ikai-api-client,apiPackage=com.ikai.api,modelPackage=com.ikai.model,invokerPackage=com.ikai.client
```

**Usage:**
```java
import com.ikai.client.ApiClient;
import com.ikai.client.ApiException;
import com.ikai.api.AuthenticationApi;
import com.ikai.api.JobPostingsApi;
import com.ikai.model.LoginRequest;
import com.ikai.model.LoginResponse;

public class IkaiApiExample {
    public static void main(String[] args) {
        ApiClient client = new ApiClient();
        client.setBasePath("http://localhost:8102");

        // Login
        AuthenticationApi authApi = new AuthenticationApi(client);
        LoginRequest loginReq = new LoginRequest()
            .email("test-admin@test-org-1.com")
            .password("TestPass123!");

        try {
            LoginResponse loginRes = authApi.apiV1AuthLoginPost(loginReq);
            String token = loginRes.getToken();

            // Set token for subsequent requests
            client.setAccessToken(token);

            // Get job postings
            JobPostingsApi jobsApi = new JobPostingsApi(client);
            List<JobPosting> jobs = jobsApi.apiV1JobPostingsGet();
            System.out.println("Job postings: " + jobs.size());

        } catch (ApiException e) {
            System.err.println("API Exception: " + e.getMessage());
        }
    }
}
```

---

### C# Client

```bash
openapi-generator-cli generate \
  -i docs/api/openapi.json \
  -g csharp-netcore \
  -o sdks/csharp \
  --additional-properties=packageName=Ikai.ApiClient,targetFramework=net6.0
```

**Usage:**
```csharp
using Ikai.ApiClient.Api;
using Ikai.ApiClient.Client;
using Ikai.ApiClient.Model;

var config = new Configuration
{
    BasePath = "http://localhost:8102"
};

var authApi = new AuthenticationApi(config);

// Login
var loginRequest = new LoginRequest
{
    Email = "test-admin@test-org-1.com",
    Password = "TestPass123!"
};

var loginResponse = await authApi.ApiV1AuthLoginPostAsync(loginRequest);
var token = loginResponse.Token;

// Configure with token
config.AccessToken = token;

// Get job postings
var jobsApi = new JobPostingsApi(config);
var jobs = await jobsApi.ApiV1JobPostingsGetAsync();
Console.WriteLine($"Found {jobs.Count} job postings");
```

---

## 🔧 Advanced Configuration

### Custom Templates

Generate SDK with custom templates:

```bash
openapi-generator-cli generate \
  -i docs/api/openapi.json \
  -g typescript-axios \
  -o sdks/typescript-custom \
  -t templates/typescript \
  --additional-properties=supportsES6=true
```

### Multiple SDKs at Once

**Bash script:**
```bash
#!/bin/bash

# Generate all SDKs
for lang in typescript-axios python java csharp-netcore; do
  echo "Generating $lang SDK..."
  openapi-generator-cli generate \
    -i docs/api/openapi.json \
    -g $lang \
    -o sdks/$lang
done

echo "✅ All SDKs generated!"
```

---

## 📝 SDK Features

### Generated Code Includes:

1. **API Classes**
   - AuthenticationApi
   - JobPostingsApi
   - CandidatesApi
   - AnalysesApi
   - OffersApi
   - InterviewsApi
   - etc.

2. **Models**
   - User
   - Organization
   - JobPosting
   - Candidate
   - Analysis
   - JobOffer
   - Interview
   - Error

3. **Configuration**
   - Base path
   - Authentication (Bearer token)
   - Custom headers
   - Timeout settings

4. **Documentation**
   - README.md
   - API method docs
   - Model property docs

---

## 🧪 Testing Generated SDK

### TypeScript Example Test

```typescript
import { Configuration, AuthenticationApi } from 'ikai-api-client';
import { expect } from 'chai';

describe('IKAI API Client', () => {
  let config: Configuration;
  let authApi: AuthenticationApi;

  beforeEach(() => {
    config = new Configuration({
      basePath: 'http://localhost:8102'
    });
    authApi = new AuthenticationApi(config);
  });

  it('should login successfully', async () => {
    const response = await authApi.apiV1AuthLoginPost({
      email: 'test-admin@test-org-1.com',
      password: 'TestPass123!'
    });

    expect(response.data.token).to.be.a('string');
    expect(response.data.user.role).to.equal('ADMIN');
  });
});
```

### Python Example Test

```python
import unittest
import ikai_api

class TestIkaiApi(unittest.TestCase):
    def setUp(self):
        self.configuration = ikai_api.Configuration(
            host = "http://localhost:8102"
        )

    def test_login(self):
        with ikai_api.ApiClient(self.configuration) as api_client:
            auth_api = ikai_api.AuthenticationApi(api_client)

            login_request = ikai_api.LoginRequest(
                email="test-admin@test-org-1.com",
                password="TestPass123!"
            )
            response = auth_api.api_v1_auth_login_post(login_request)

            self.assertIsNotNone(response.token)
            self.assertEqual(response.user.role, "ADMIN")

if __name__ == '__main__':
    unittest.main()
```

---

## 📦 Publishing SDKs

### npm (TypeScript/JavaScript)

```bash
cd sdks/typescript

# Update package.json version
npm version patch

# Publish to npm
npm publish
```

**Install in projects:**
```bash
npm install ikai-api-client
```

---

### PyPI (Python)

```bash
cd sdks/python

# Build distribution
python setup.py sdist bdist_wheel

# Upload to PyPI
twine upload dist/*
```

**Install in projects:**
```bash
pip install ikai-api-client
```

---

### Maven Central (Java)

```bash
cd sdks/java

# Build with Maven
mvn clean install

# Deploy to Maven Central
mvn deploy
```

**Use in pom.xml:**
```xml
<dependency>
    <groupId>com.ikai</groupId>
    <artifactId>ikai-api-client</artifactId>
    <version>1.0.0</version>
</dependency>
```

---

### NuGet (C#)

```bash
cd sdks/csharp

# Pack NuGet package
dotnet pack

# Publish to NuGet
dotnet nuget push bin/Release/Ikai.ApiClient.1.0.0.nupkg --api-key YOUR_API_KEY --source https://api.nuget.org/v3/index.json
```

**Install in projects:**
```bash
dotnet add package Ikai.ApiClient
```

---

## 🔄 Continuous Integration

### GitHub Actions (Auto-generate on OpenAPI changes)

```yaml
name: Generate SDKs

on:
  push:
    paths:
      - 'docs/api/openapi.json'

jobs:
  generate-sdks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install OpenAPI Generator
        run: npm install @openapitools/openapi-generator-cli -g

      - name: Generate TypeScript SDK
        run: |
          openapi-generator-cli generate \
            -i docs/api/openapi.json \
            -g typescript-axios \
            -o sdks/typescript

      - name: Generate Python SDK
        run: |
          openapi-generator-cli generate \
            -i docs/api/openapi.json \
            -g python \
            -o sdks/python

      - name: Commit generated SDKs
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add sdks/
          git commit -m "chore: Auto-generate SDKs from OpenAPI spec"
          git push
```

---

## 📚 Additional Resources

- [OpenAPI Generator Documentation](https://openapi-generator.tech/)
- [Supported Generators List](https://openapi-generator.tech/docs/generators)
- [Configuration Options](https://openapi-generator.tech/docs/global-properties)

---

## 🆘 Troubleshooting

### Issue: Generator not found

```bash
npm install @openapitools/openapi-generator-cli -g
openapi-generator-cli version-manager set 7.0.1
```

### Issue: Invalid OpenAPI spec

```bash
# Validate spec
openapi-generator-cli validate -i docs/api/openapi.json
```

### Issue: Generated code has errors

- Check OpenAPI spec validity
- Update generator version
- Use custom templates
- File issue on OpenAPI Generator GitHub

---

**Generated by:** Worker Claude (Sonnet 4.5)
**Date:** 2025-11-04
**Task:** W1 - SDK Generation Guide
