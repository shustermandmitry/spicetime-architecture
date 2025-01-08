# Beer Components and Composition System

## Base Components (Primitives)

### Fermentables

```jsx
// Base Malts (Required enzyme source)
const BaseMalt = {
  TwoRowPale: {
    type: "2-row pale malt",
    purpose: "enzyme source, main fermentable",
    baseAmount: "8-10 lbs/5gal",
    characteristics: ["clean", "mild", "efficient"],
    enzymeContent: "high"
  }
}

// Character Malts (Color/Flavor)
const CharacterMalt = {
  Crystal60L: {
    type: "crystal/caramel",
    color: "60L",
    purpose: "sweetness, color, body",
    maxPercent: 15,
    characteristics: ["caramel", "toffee", "body"]
  },
  ChocolateMalt: {
    type: "chocolate malt",
    color: "350L",
    purpose: "dark color, roast flavor",
    maxPercent: 7,
    characteristics: ["chocolate", "coffee", "smooth"]
  },
  RoastedBarley: {
    type: "roasted barley",
    color: "500L",
    purpose: "dry roast, black color",
    maxPercent: 5,
    characteristics: ["coffee", "sharp", "dry"]
  },
  BlackPatent: {
    type: "black patent",
    color: "500L",
    purpose: "black color, strong roast",
    maxPercent: 2,
    characteristics: ["burnt", "bitter", "intense"]
  }
}

// Adjuncts (Body/Head)
const Adjunct = {
  FlakedBarley: {
    type: "flaked barley",
    purpose: "body, head retention",
    maxPercent: 15,
    characteristics: ["creamy", "smooth", "foam"]
  }
}
```

### Hops

```jsx
const Bittering = {
  NorthernBrewer: {
    type: "northern brewer",
    alpha: "8-10%",
    purpose: "clean bitter",
    timing: "60 min",
    characteristics: ["clean", "neutral"]
  },
  Magnum: {
    type: "magnum",
    alpha: "10-14%",
    purpose: "efficient bitter",
    timing: "60 min",
    characteristics: ["clean", "neutral"]
  }
}

const Aroma = {
  Saaz: {
    type: "saaz",
    alpha: "3-4.5%",
    purpose: "spicy aroma",
    timing: "15-0 min",
    characteristics: ["spicy", "earthy", "noble"]
  },
  EastKentGoldings: {
    type: "east kent goldings",
    alpha: "4-6%",
    purpose: "earthy aroma",
    timing: "15-0 min",
    characteristics: ["earthy", "spicy", "subtle"]
  },
  Hallertau: {
    type: "hallertau",
    alpha: "3.5-5.5%",
    purpose: "floral aroma",
    timing: "15-0 min",
    characteristics: ["floral", "mild", "noble"]
  }
}
```

### Yeast

```jsx
const Yeast = {
  AmericanAle: {
    type: "US-05",
    attenuation: "75-82%",
    flocculation: "medium",
    tempRange: "59-75F",
    characteristics: ["clean", "neutral"]
  },
  EnglishAle: {
    type: "S-04",
    attenuation: "73-77%",
    flocculation: "high",
    tempRange: "64-74F",
    characteristics: ["fruity", "malty"]
  },
  IrishAle: {
    type: "WLP004",
    attenuation: "69-74%",
    flocculation: "high",
    tempRange: "65-68F",
    characteristics: ["clean", "malty"]
  }
}
```

## Higher Order Components (Beer Styles)

### Base Styles

```jsx
const Ale = {
  base: BaseMalt.TwoRowPale,
  hops: [Bittering.NorthernBrewer, Aroma.EastKentGoldings],
  yeast: Yeast.AmericanAle,
  specs: {
    OG: "1.048-1.054",
    FG: "1.010-1.014",
    IBU: "20-30",
    Color: "4-7 SRM"
  }
}

// Extension of Ale
const EnglishAle = {
  ...Ale,
  character: CharacterMalt.Crystal60L,
  adjunct: Adjunct.FlakedBarley,
  yeast: Yeast.EnglishAle,
  specs: {
    OG: "1.048-1.056",
    FG: "1.012-1.016",
    IBU: "25-35",
    Color: "8-14 SRM"
  }
}
```

### Style Modifiers

```jsx
// Can be applied to base styles
const StoutModifier = {
  additions: [
    CharacterMalt.RoastedBarley,
    CharacterMalt.ChocolateMalt,
    Adjunct.FlakedBarley
  ],
  specs: {
    colorAdd: "+25 SRM",
    ogAdd: "+0.008",
    fgAdd: "+0.002",
    ibuAdd: "+10"
  }
}

const BrownModifier = {
  additions: [
    CharacterMalt.ChocolateMalt,
    CharacterMalt.Crystal60L
  ],
  specs: {
    colorAdd: "+15 SRM",
    ogAdd: "+0.004",
    fgAdd: "+0.001",
    ibuAdd: "+5"
  }
}
```

## Recipe Composition

```jsx
// Basic American Ale
const BasicAle = {
  name: "Basic American Ale",
  base: Ale,
  grainBill: [
    { malt: BaseMalt.TwoRowPale, amount: "9 lbs" }
  ],
  hops: [
    { hop: Bittering.NorthernBrewer, amount: "1 oz", time: "60" },
    { hop: Aroma.EastKentGoldings, amount: "0.5 oz", time: "15" }
  ],
  yeast: Yeast.AmericanAle
}

// Stout from Ale base
const BasicStout = {
  name: "Basic Stout",
  base: Ale,
  modifier: StoutModifier,
  grainBill: [
    { malt: BaseMalt.TwoRowPale, amount: "9 lbs" },
    { malt: CharacterMalt.RoastedBarley, amount: "0.5 lb" },
    { malt: CharacterMalt.ChocolateMalt, amount: "0.5 lb" },
    { adjunct: Adjunct.FlakedBarley, amount: "0.5 lb" }
  ],
  hops: [
    { hop: Bittering.NorthernBrewer, amount: "1.5 oz", time: "60" }
  ],
  yeast: Yeast.IrishAle
}
```

## Minimum Shopping List for Maximum Variety

### Essential Components

1. Base Malt:

- 5 lbs 2-Row Pale Malt (base for everything)

2. Character Malts (1/4-1/2 lb each):

- Crystal 60L (sweetness/body)
- Chocolate Malt (dark color/flavor)
- Roasted Barley (stouts/porters)

3. Adjuncts:

- Flaked Barley (1/2 lb)

4. Hops:

- Northern Brewer (2 oz, bittering)
- East Kent Goldings (2 oz, aroma)
- Hallertau (1 oz, aroma)

5. Yeast:

- US-05 American Ale (versatile base)
- S-04 English Ale (malty styles)

### What You Can Make

With these ingredients you can compose:

1. American Ale (base)
2. English Ale (base + crystal)
3. Brown Ale (base + chocolate + crystal)
4. Porter (base + chocolate + crystal + roasted)
5. Stout (base + roasted + flaked)
6. Irish Red (base + crystal + roasted)

## Style Hierarchy

```
Beer
├── Ale Family
│   ├── Pale Ale (Base)
│   │   └── IPA (Hop Modifier)
│   ├── Brown Ale (Brown Modifier)
│   ├── Porter (Dark Modifier)
│   └── Stout (Stout Modifier)
│       └── Irish Stout (Regional Variant)
└── Lager Family (different base yeast/process)
    └── [Future Expansion]
```

This component system allows you to:

1. Start with basic recipes
2. Modify styles systematically
3. Understand ingredient relationships
4. Scale complexity gradually
5. Experiment methodically
