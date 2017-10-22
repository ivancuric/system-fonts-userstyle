const fs = require('fs-extra');

const fontsToReplace = {
  mono: [
    'Courier',
    'Courier New',
    // 'Andale Mono',
  ],
  sans: [
    'Arial',
    'Helvetica',
    'Helvetica Neue',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    // 'Comic Sans MS',
  ],
};

const replacementFonts = {
  mono: [
    {
      family: 'Menlo',
      italic: ' Italic',
      weights: {
        400: ' Regular',
        700: ' Bold',
      },
    },
    {
      family: 'Consolas',
      italic: ' Italic',
      weights: {
        400: '',
        700: '',
      },
    },
  ],
  sans: [
    {
      family: '.SFNSText',
      italic: 'Italic',
      weights: {
        300: '-Light',
        400: '',
        500: '-Medium',
        600: '-Semibold',
        700: '-Bold',
        900: '-Black',
      },
    },
    {
      family: 'Segoe UI',
      italic: ' Italic',
      weights: {
        200: '',
        300: '',
        400: '',
        600: '',
        700: '',
        900: '',
      },
    },
    // {
    //   family: 'Roboto',
    //   italic: ' Italic',
    //   weights: {
    //     200: 'Light',
    //     300: 'Semilight',
    //     400: 'Regular',
    //     500: 'Medium',
    //     700: 'Bold',
    //     900: 'Black',
    //   },
    // },
    // {
    //   family: 'Ubuntu',
    //   italic: ' Italic',
    //   weights: {
    //     300: 'Light',
    //     400: 'Regular',
    //     500: 'Medium',
    //     700: 'Bold',
    //   },
    // },
    // {
    //   family: 'Cantarell',
    //   italic: ' Italic',
    //   weights: {
    //     400: 'Regular',
    //     700: 'Bold',
    //   },
    // },
  ],
};

const weightsToBuild = [
  // 100,
  // 200,
  300,
  400,
  500,
  // 600,
  700,
  // 800,
  900,
];

let result = `body {
  text-rendering: optimizeLegibility !important;
  font-feature-settings: "liga", "clig", "kern";
}`;

const nearestWeight = (familyWeights, requiredWeight) => {
  const weightsArr = Object.keys(familyWeights);
  let i = 0;
  let nearest = weightsArr[i];

  while (nearest < requiredWeight) {
    nearest = weightsArr[i];
    i++;
  }

  return nearest;
};

const fontFaceTemplate = (
  originalFontName,
  props,
  weightValue,
  type,
  isItalic,
) => `
@font-face {
  font-family: "${originalFontName}";
  font-style: ${isItalic ? 'italic' : 'normal'};
  font-weight: ${weightValue};
  src: ${generateLocalFamily(weightValue, props, type, isItalic)};
}`;

const generateLocalFamily = (weightValue, props, type, isItalic) =>
  replacementFonts[type]
    .map(
      props =>
        `local("${props.family}${props.weights[
          nearestWeight(props.weights, weightValue)
        ]}${isItalic ? props.italic : ''}")`,
    )
    .join(',');

const generateRule = (type, fonts) => {
  fonts.forEach(originalFontName => {
    replacementFonts[type].forEach(props => {
      weightsToBuild.forEach(weightValue => {
        result += fontFaceTemplate(
          originalFontName,
          props,
          weightValue,
          type,
          false,
        );
        result += fontFaceTemplate(
          originalFontName,
          props,
          weightValue,
          type,
          true,
        );
      });
    });
  });
};

// ENTRY
Object.entries(fontsToReplace).forEach(([type, fonts]) => {
  generateRule(type, fonts);
  fs.outputFileSync('../build/userstyle.css', result);
});
