# WebSocket Events Documentation

This file documents all WebSocket (Socket.IO) events used in the backend. Update this file whenever you add, remove, or change events.

| Event Name                | Description                                 | Emitted By / Location                        |
|--------------------------|---------------------------------------------|----------------------------------------------|
| `activeUsers`            | Number of currently active users            | `authentication.controller.js`, `socket/emit.js` |
| `currentActiveRestaurants`| Number of currently active restaurants      | `socket/emit.js`                             |
| `orderStatusUpdated`     | Order status change notification            | `order.controller.js`                        |

## Example Usage

### Emitting an Event
```js
io.emit('activeUsers', activeUsersCount);
```

### Listening for an Event (Client Side)
```js
socket.on('orderStatusUpdated', (data) => {
  // handle order status update
});
```

---

**Tip:**
- Add new events here as your project grows.
- Keep event names consistent and descriptive. 