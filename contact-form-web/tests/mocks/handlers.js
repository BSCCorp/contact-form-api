import { http, HttpResponse } from "msw";

const user = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane@example.com",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const emailAccount = {
  _id: "account-1",
  name: "My SMTP Account",
  host: "127.0.0.1",
  port: 1025,
  secure: false,
  username: "sender@example.com",
  from: "sender@example.com",
};

const contactForm = {
  _id: "contact-1",
  userId: "user-1",
  emailAccountId: "account-1",
  name: "John Smith",
  email: "john@example.com",
  subject: "I need help",
  message: "Please help me with my account.",
  deliveryStatus: "sent",
};

export const handlers = [
  /*
   * AUTH
   */

  http.post("/api/auth/register", async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json(
      {
        user: {
          ...user,
          name: body.name,
          email: body.email,
        },
        token: "test-token",
      },
      { status: 201 }
    );
  }),

  http.post("/api/auth/login", async ({ request }) => {
    const body = await request.json();

    if (
      body.email === "wrong@example.com" ||
      body.password === "wrong"
    ) {
      return HttpResponse.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      user,
      token: "test-token",
    });
  }),

  http.get("/api/auth/me", () => {
    return HttpResponse.json({
      user,
    });
  }),

  /*
   * EMAIL ACCOUNTS
   */

  http.get("/api/email-accounts", () => {
    return HttpResponse.json({
      data: [emailAccount],
    });
  }),

  http.post("/api/email-accounts", async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json(
      {
        data: {
          ...emailAccount,
          ...body,
          _id: "account-new",
        },
      },
      { status: 201 }
    );
  }),

  http.get(
    "/api/email-accounts/:id",
    ({ params }) => {
      if (params.id === "missing") {
        return HttpResponse.json(
          {
            error: "Email account not found",
          },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        data: emailAccount,
      });
    }
  ),

  // IMPORTANT: frontend uses PUT, so MSW must use PUT.
  http.put(
    "/api/email-accounts/:id",
    async ({ request, params }) => {
      const body = await request.json();

      return HttpResponse.json({
        data: {
          ...emailAccount,
          ...body,
          _id: params.id,
        },
      });
    }
  ),

  http.delete("/api/email-accounts/:id", () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),

  http.post(
    "/api/email-accounts/:id/test",
    () => {
      return HttpResponse.json({
        data: {
          success: true,
          message: "SMTP connection verified",
        },
      });
    }
  ),

  /*
   * CONTACT FORMS
   */

  http.get("/api/contact-forms", () => {
    return HttpResponse.json({
      data: [contactForm],
    });
  }),

  http.post("/api/contact-forms", async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json(
      {
        data: {
          ...contactForm,
          ...body,
          _id: "contact-new",
        },
      },
      { status: 201 }
    );
  }),

  http.get(
    "/api/contact-forms/:id",
    ({ params }) => {
      if (params.id === "missing") {
        return HttpResponse.json(
          {
            error: "Contact form not found",
          },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        data: contactForm,
      });
    }
  ),

  http.delete("/api/contact-forms/:id", () => {
    return new HttpResponse(null, {
      status: 204,
    });
  }),
];

