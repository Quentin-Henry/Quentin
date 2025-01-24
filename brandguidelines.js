// brandguidelines.js
const BrandGuidelines = () => {
  const colors = {
    background: "#1d1d1d",
    text: "#f1f1f1",
    textMuted: "#888",
    accent: "#FF0000",
    beige: "#F5F5DC",
  };

  // Create elements using React.createElement instead of JSX
  return React.createElement(
    "div",
    {
      className: "content-section w-full space-y-8",
      style: { background: colors.background, color: colors.text },
    },
    [
      React.createElement(
        "h3",
        {
          className: "section-title text-2xl font-medium",
          key: "title",
        },
        "Brand Guidelines"
      ),

      React.createElement(
        "div",
        {
          className: "grid grid-cols-1 gap-8",
          key: "content",
        },
        [
          // Typography Section
          React.createElement(
            "div",
            {
              className: "bg-[#333] p-6 rounded-lg",
              key: "typography",
            },
            [
              React.createElement(
                "h4",
                {
                  className: "text-lg text-[#888] mb-4",
                  key: "typography-title",
                },
                "Typography"
              ),

              // Display Typography
              React.createElement(
                "div",
                {
                  className: "space-y-6",
                  key: "display-typography",
                },
                [
                  React.createElement("div", { key: "bookman" }, [
                    React.createElement(
                      "h2",
                      {
                        style: {
                          fontFamily: "Bookman JF, serif",
                          fontStyle: "italic",
                        },
                        className: "text-6xl",
                      },
                      "Bookman JF Italic"
                    ),
                    React.createElement(
                      "p",
                      {
                        className: "text-[#888] mt-2",
                      },
                      "Display Font - Headlines & Key Messaging"
                    ),
                  ]),
                ]
              ),

              // Body Typography
              React.createElement(
                "div",
                {
                  className: "pt-8 border-t border-[#444] mt-8",
                  key: "body-typography",
                },
                [
                  React.createElement(
                    "h4",
                    {
                      className: "text-lg text-[#888] mb-4",
                    },
                    "Body Typography"
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "space-y-6",
                    },
                    [
                      React.createElement("div", { key: "gotham" }, [
                        React.createElement(
                          "p",
                          {
                            style: { fontFamily: "Gotham, sans-serif" },
                            className: "text-xl",
                          },
                          "Gotham - Large Body"
                        ),
                        React.createElement(
                          "p",
                          {
                            className: "text-[#888] mt-2",
                          },
                          "20px / Leading statements"
                        ),
                      ]),
                    ]
                  ),
                ]
              ),
            ]
          ),
        ]
      ),
    ]
  );
};

// Export for use
window.BrandGuidelines = BrandGuidelines;
