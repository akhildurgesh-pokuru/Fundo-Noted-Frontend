
import { test, expect } from "@playwright/test";

test("UC10 - Real Notes CRUD and Organization", async ({
  request
}) => {
  const email = process.env.FUNDOO_TEST_EMAIL;
  const password = process.env.FUNDOO_TEST_PASSWORD;

  test.skip(
    !email || !password,
    "Set FUNDOO_TEST_EMAIL and FUNDOO_TEST_PASSWORD."
  );

  // Login through the real API Gateway.
  const login = await request.post("/api/users/login", {
    data: {
      email,
      password
    }
  });

  console.log("Login HTTP status:", login.status());

expect(
  login.ok(),
  `Login failed with HTTP ${login.status()}`
).toBeTruthy();

  const loginData = await login.json();
  const token = loginData.token;

  expect(token).toBeTruthy();

  const headers = {
    Authorization: `Bearer ${token}`
  };

  let noteId = null;

  try {
    // CREATE
    const created = await request.post("/api/notes", {
      headers,
      data: {
        title: "UC10 Automated Test",
        description: "Created by Playwright integration test."
      }
    });

    expect(created.status()).toBe(201);

    const createdNote = await created.json();

    noteId = createdNote.id;

    expect(noteId).toBeTruthy();

    // READ
    const read = await request.get(
      `/api/notes/${noteId}`,
      { headers }
    );

    expect(read.status()).toBe(200);

    const savedNote = await read.json();

    expect(savedNote.title).toBe(
      "UC10 Automated Test"
    );

    expect(savedNote.description).toBe(
      "Created by Playwright integration test."
    );

    // UPDATE
    const updated = await request.put(
      `/api/notes/${noteId}`,
      {
        headers,
        data: {
          title: "UC10 Updated Test",
          description: "Updated through real Spring Boot."
        }
      }
    );

    expect(updated.status()).toBe(200);

    // PIN
    const pinned = await request.patch(
      `/api/notes/${noteId}/pin`,
      { headers }
    );

    expect(pinned.status()).toBe(200);
    expect((await pinned.json()).pinned).toBe(true);

    // UNPIN
    const unpinned = await request.patch(
      `/api/notes/${noteId}/unpin`,
      { headers }
    );

    expect(unpinned.status()).toBe(200);
    expect((await unpinned.json()).pinned).toBe(false);

    // ARCHIVE
    const archived = await request.patch(
      `/api/notes/${noteId}/archive`,
      { headers }
    );

    expect(archived.status()).toBe(200);

    // UNARCHIVE
    const unarchived = await request.patch(
      `/api/notes/${noteId}/unarchive`,
      { headers }
    );

    expect(unarchived.status()).toBe(200);

    // TRASH
    const trashed = await request.patch(
      `/api/notes/${noteId}/trash`,
      { headers }
    );

    expect(trashed.status()).toBe(200);

    // RESTORE
    const restored = await request.patch(
      `/api/notes/${noteId}/restore`,
      { headers }
    );

    expect(restored.status()).toBe(200);

    // Check that the note still exists after restore.
    const finalRead = await request.get(
      `/api/notes/${noteId}`,
      { headers }
    );

    expect(finalRead.status()).toBe(200);

    expect((await finalRead.json()).title).toBe(
      "UC10 Updated Test"
    );
} finally {
    // Clean up only the note created by this test.
    if (noteId !== null) {
      // A restored note may need to be moved back
      // to Trash before permanent deletion.
      const trashResponse = await request.patch(
        `/api/notes/${noteId}/trash`,
        { headers }
      );
  
      expect(
        trashResponse.ok(),
        `Cleanup trash failed: HTTP ${trashResponse.status()}`
      ).toBeTruthy();
  
      const deleted = await request.delete(
        `/api/notes/${noteId}/permanent`,
        { headers }
      );
  
      expect(
        deleted.status(),
        `Permanent deletion failed: HTTP ${deleted.status()}`
      ).toBe(204);
    }
  }
});
