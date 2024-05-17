import { render, screen } from "@testing-library/react";
import createTestServer from "../../test/server";
import AuthButtons from "./AuthButtons";
import { MemoryRouter } from "react-router";
import { SWRConfig } from "swr";

async function renderComponent() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );

  await screen.findAllByRole("link");
}

describe("when user is not authenticated", () => {
  createTestServer([{ path: "/api/user", res: () => {} }]);

  test("show sign in/up buttons", async () => {
    await renderComponent();

    const signInButton = screen.getByRole("link", { name: /sign in/i });
    const signOutButton = screen.getByRole("link", { name: /sign up/i });

    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/signin");
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("href", "/signup");
  });

  test("hide sign out button", async () => {
    await renderComponent();

    const signOutButton = screen.queryByRole("link", { name: /sign out/i });

    expect(signOutButton).not.toBeInTheDocument();
  });
});

describe("when user is authenticated", () => {
  createTestServer([
    { path: "/api/user", res: () => ({ user: { id: 1, email: "hi@hi.com" } }) },
  ]);

  test("show sign out button", async () => {
    await renderComponent();

    const signInButton = screen.queryByRole("link", { name: /sign in/i });
    const signUpButton = screen.queryByRole("link", { name: /sign up/i });

    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });

  test("hide sign in/up buttons", async () => {
    await renderComponent();

    const signOutButton = screen.getByRole("link", { name: /sign out/i });

    expect(signOutButton).toHaveAttribute("href", "/signout");
    expect(signOutButton).toBeInTheDocument();
  });
});
