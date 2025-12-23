# Bruno API Testing Collections

GettUpp Enterprise uses **Bruno** for API testing - a Git-native, offline-first alternative to Postman.

## Why Bruno?

- ✅ **$0 cost** (open source)
- ✅ **Git-native** (collections stored in repository)
- ✅ **Offline-first** (no cloud dependency)
- ✅ **Fast** (native performance)
- ✅ **Team collaboration** (via Git)

## Installation

Download from [usebruno.com](https://www.usebruno.com/)

## Collections

API collections are stored in `./bruno/` directory:

- `bruno/auth/` - Authentication endpoints
- `bruno/photos/` - Photo upload and retrieval
- `bruno/shoots/` - Shoot management
- `bruno/qr/` - QR code generation and delivery
- `bruno/admin/` - Admin dashboard APIs

## Usage

1. **Open Bruno**
2. **Import Collection**: File → Open Collection → Select `./bruno` directory
3. **Select Environment**: Production, Staging, or Local
4. **Run Requests**: Click "Send"

## Environment Variables

Bruno supports environment-specific variables. Configure in Bruno UI:

**Local**:
```
API_URL=http://localhost:3000
```

**Staging**:
```
API_URL=https://staging.gettup.com
```

**Production**:
```
API_URL=https://gettup.com
```

## Organization

Collections are organized by feature:

```
bruno/
├── auth/
│   ├── login.bru
│   ├── register.bru
│   └── logout.bru
├── photos/
│   ├── upload.bru
│   ├── list.bru
│   └── download.bru
├── shoots/
│   ├── create.bru
│   ├── get.bru
│   └── delete.bru
└── environments/
    ├── local.json
    ├── staging.json
    └── production.json
```

## Creating New Requests

1. **Right-click folder** in Bruno
2. **New Request**
3. **Configure**:
   - Method (GET, POST, etc.)
   - URL (use `{{API_URL}}` variable)
   - Headers
   - Body (if applicable)
4. **Save**
5. **Commit to Git**

## Testing Workflows

### Example: Test Photo Upload Flow

1. **Authenticate**: Run `auth/login.bru`
2. **Create Shoot**: Run `shoots/create.bru`
3. **Upload Photo**: Run `photos/upload.bru`
4. **Verify Photo**: Run `photos/list.bru`

Bruno supports **chaining requests** - responses from one request can be used in the next.

## Common Requests

### Authentication
```http
POST {{API_URL}}/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "your_password"
}
```

### Create Shoot
```http
POST {{API_URL}}/api/shoots
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "venueId": "legacy",
  "name": "Friday Night",
  "shootDate": "2025-12-20"
}
```

### Upload Photo
```http
POST {{API_URL}}/api/photos/upload
Authorization: Bearer {{auth_token}}
Content-Type: multipart/form-data

file=@/path/to/photo.jpg
shootId={{shoot_id}}
```

## Git Integration

Bruno collections are plain text files (`.bru` format). They can be:

- ✅ Version controlled
- ✅ Reviewed in PRs
- ✅ Shared with team
- ✅ Branched/merged

**Example workflow**:
```bash
# Create a new API endpoint
git checkout -b feature/new-api

# Add Bruno request
# ... create request in Bruno ...

# Commit
git add bruno/new-endpoint.bru
git commit -m "Add new API endpoint test"

# Push and create PR
git push origin feature/new-api
```

## Migrating from Postman

If you have existing Postman collections:

1. **Export from Postman**: Collection → Export → Collection v2.1
2. **Import to Bruno**: File → Import Collection → Select exported JSON

## Next Steps

1. Download and install Bruno
2. Open the `./bruno` directory in Bruno
3. Run the health check requests to verify setup
4. Create requests for new God Mode 2.0 endpoints (Turso, Cloudflare Workers)

---

**Note**: Bruno collections will be created after edge infrastructure is deployed and testable.
