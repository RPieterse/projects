import { screen, render } from "@testing-library/vue";
import { describe, it, expect } from "vitest";
import StatusIndicator from "@/components/StatusIndicator.vue";
import { createVuetify } from "vuetify/lib/framework.mjs";

describe("StatusIndicator", () => {
  const vuetify = createVuetify();
  it("Status text is correct", () => {
    render(StatusIndicator, {
      props: {
        status: "inprogress",
      },
      global: {
        plugins: [vuetify],
      },
    });
    const indicator = screen.getByTestId("status-indicator");
    expect(indicator.textContent).toBe("In Progress");
  });
  it("Status text should be unknown", () => {
    render(StatusIndicator, {
      props: {
        status: "something",
      },
      global: {
        plugins: [vuetify],
      },
    });
    const indicator = screen.getByTestId("status-indicator");
    expect(indicator.textContent).toBe("Unknown");
  });
});
