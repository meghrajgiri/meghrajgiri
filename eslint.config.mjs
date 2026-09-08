import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      /**
       * Let `_`-prefixed bindings go unused.
       *
       * Destructuring is how JavaScript drops a key from an object, and the discarded
       * binding is unavoidably "unused": `const { blog: _blog, ...rest } = config` is
       * the idiom for "everything except blog". Flagging it pushes you towards a disable
       * comment at every occurrence, or a mutable copy plus `delete` — both worse than
       * what is being flagged. The underscore is the signal that the value is discarded
       * on purpose.
       */
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];

export default eslintConfig;
