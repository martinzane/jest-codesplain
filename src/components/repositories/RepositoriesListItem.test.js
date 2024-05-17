import { render, screen } from "@testing-library/react";
import RepositoriesListItem from "./RepositoriesListItem";
import { MemoryRouter } from "react-router";

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "JavaScript",
    description: "A JS Library",
    owner: "facebook",
    name: "react",
    html_url: "https://github.com/facebook/react",
  };

  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  return { repository };
}

test("shows a link to the github homepage", async () => {
  const { repository } = renderComponent();

  await screen.findByRole("img", { name: "JavaScript" });

  const link = screen.getByRole("link", { name: /github repository/i });
  expect(link).toHaveAttribute("href", repository.html_url);
});
