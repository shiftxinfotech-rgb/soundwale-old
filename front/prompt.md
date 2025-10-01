Design Prompt

Convert this Figma design into React Native code using a modern, modular approach. Follow the guidelines below to ensure the code is production-ready and maintainable:

♻️ Reusability

- Reuse components from the project (e.g., `Button`, `Card`, `Input`) where applicable.
- Extract subcomponents when elements are reused or logically grouped.
- Use design tokens (colors, spacing, fonts) from the theme instead of hardcoded values.
- Use project assets (e.g., images, logos) from the correct directories, and bundle them properly for React Native.

🧱 Architecture & Code Structure

- Use functional components, React Hooks, and TypeScript.
- Follow the project’s folder structure and naming conventions.
- Keep business logic separated from UI components.
- Use i18n translation keys instead of hardcoded text.

🎨 Styling & Theming

- Use `StyleSheet`, Tailwind CSS, or the project’s styling approach.
- Avoid hardcoded values—rely on theme tokens for spacing, colors, and typography.

🖼️ Assets & SVGs

- Use `react-native-svg` for vector graphics and icons.
- Import and bundle assets correctly for React Native environments.

🌍 Internationalization (i18n)

- Replace all user-visible text with translation keys from the i18n setup.

🚀 Performance

- Use `React.memo`, `FlatList`, and lazy loading where appropriate.
- Minimize unnecessary re-renders and avoid deeply nested components.

♿ Accessibility & Testing

- Add accessibility props (e.g., `accessibilityLabel`) for important UI elements.
- Include `testID`s for components where automated testing is expected.

🔌 Integrations

- Integrate navigation (e.g., React Navigation), form libraries (`react-hook-form`), and state management tools (Redux, Zustand) as required.

✅ Output Requirements

- Ensure the code is clean, readable, and scalable.
- Match the Figma design precisely while enabling future flexibility.
- Follow naming conventions and file structure used across the project.

📁 File & Folder Structure

- Do NOT modify or merge code into unrelated existing files (e.g., don't insert Detail Page code into Register screen).
- Create a new folder (e.g., `DetailScreen` or `ProductDetails`) inside the appropriate directory (e.g., `screens/`, `features/`, or `components/`).
- Place all related files (e.g., `index.tsx`, `styles.ts`, `hooks.ts`) inside that folder.
- If components are nested, organize them into a `components/` subfolder inside the screen folder.
