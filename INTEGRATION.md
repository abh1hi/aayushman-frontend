# 🔌 Integration Guide: Enquiry Microservice

This guide details how external applications (Mobile Apps, Web Frontends, Dispatch Systems) can integrate with the **Enquiry Intake Microservice**.

---

## 1. HTTP API (Command Interface)
**Purpose**: Submit new enquiries (commands) to the platform.

### Endpoint: `POST /enquiries`
- **URL**: `http://<SERVICE_HOST>:3000/enquiries`
- **Content-Type**: `application/json`

### Request Schema
```json
{
  "callerId": "+15550199",           // [Required] String (Phone number or Device ID)
  "location": {                      // [Required] Object
    "latitude": 40.7128,             // [Required] Number (-90 to 90)
    "longitude": -74.0060,           // [Required] Number (-180 to 180)
    "address": "123 Main St, NY"     // [Optional] String
  }
}
```

### Response Schema (Success - 201 Created)
Returns the created **Enquiry** domain entity.
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "callerId": "+15550199",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St, NY"
  },
  "status": "RECEIVED",
  "createdAt": "2026-01-30T10:00:00.000Z",
  "updatedAt": "2026-01-30T10:00:00.000Z"
}
```

### Error Responses
- **400 Bad Request**: Validation failed (invalid coordinates, missing fields).
- **500 Internal Server Error**: Infrastructure failure.

---

## 2. Event Stream (Data Interface)
**Purpose**: React to new enquiries asynchronously (e.g., Notification Service, Dispatch Dashboard, Analytics).
**Protocol**: Google Cloud Pub/Sub (CloudEvents v1.0).

### Topic: `enquiry.created`
Consumers should subscribe to this topic to receive new enquiry events.

### CloudEvent Structure
The payload adheres to the [CloudEvents v1.0 Specification](https://cloudevents.io/).

```json
{
  "specversion": "1.0",
  "type": "com.ambulance.enquiry.created",
  "source": "/enquiry-service/create-enquiry",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "time": "2026-01-30T10:00:00.000Z",
  "datacontenttype": "application/json",
  "data": {
    // Exact copy of the Enquiry Domain Entity
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "callerId": "+15550199",
    "status": "RECEIVED",
    "location": { ... }
  }
}
```

### Integration Pattern (Pub/Sub)
1. **Create a Subscription** on the `enquiry.created` topic in your consumer service.
2. **Process**: Parse the JSON body.
3. **Idempotency**: Use the `id` field (CloudEvent ID) to deduplicate messages.

---

## 3. SDK / Library Code Examples

### cURL
```bash
curl -X POST http://localhost:3000/enquiries \
  -H "Content-Type: application/json" \
  -d '{"callerId": "+12345", "location": {"latitude": 12.0, "longitude": 77.0}}'
```

### JavaScript / TypeScript (Fetch)
```typescript
const response = await fetch('http://localhost:3000/enquiries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    callerId: '+1234567890',
    location: { latitude: 12.9716, longitude: 77.5946 }
  })
});
const enquiry = await response.json();
```
