const fs = require('fs-extra');

const fontsToReplace = {
  mono: ['Courier', 'Courier New'],
  sans: [
    'Arial',
    'Helvetica',
    'Helvetica Neue',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
  ],
};

const replacementFonts = {
  mono: [
    {
      family: 'Menlo',
      regular: {
        400: '-Regular',
        700: '-Bold',
      },
      italic: {
        400: '-Italic',
        700: '-BoldItalic',
      },
    },
    {
      family: 'Consolas',
      regular: {
        400: '',
        700: '-Bold',
      },
      italic: {
        400: '-Italic',
        700: '-BoldItalic',
      },
    },
  ],
  sans: [
    {
      family: '.SFNSText',
      regular: {
        300: '-Light',
        400: '',
        500: '-Medium',
        600: '-Semibold',
        700: '-Bold',
        900: '-Black',
      },
      italic: {
        300: '-LightItalic',
        400: '-Italic',
        500: '-MediumItalic',
        600: '-SemiboldItalic',
        700: '-BoldItalic',
        900: '-BlackItalic',
      },
    },
    {
      family: 'SegoeUI',
      regular: {
        200: '-Light',
        300: '-Semilight',
        400: '',
        600: '-Semibold',
        700: '-Bold',
        900: '-Black',
      },
      italic: {
        200: '-LightItalic',
        300: '-SemilightItalic',
        400: '-Italic',
        600: '-SemiboldItalic',
        700: '-BoldItalic',
        900: '-BlackItalic',
      },
    },
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
  // 900,
];

let result = `body {
  text-rendering: optimizeLegibility !important;
  font-feature-settings: "liga", "clig", "kern";
}`;

const nearestWeight = (familyWeights, requiredWeight) => {
  const weightsArr = Object.keys(familyWeights);
  let i = 0;
  let nearest = 100;
  // console.log(weightsArr);
  // console.log(requiredWeight);

  while (nearest < requiredWeight) {
    if (weightsArr[i]) {
      nearest = weightsArr[i];
    } else {
      return weightsArr[i - 1];
    }
    i++;
  }

  // console.log(`result: ${nearest}`);

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
        `local("${props.family}${isItalic
          ? props.italic[nearestWeight(props.italic, weightValue)]
          : props.regular[nearestWeight(props.regular, weightValue)]}")`,
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
