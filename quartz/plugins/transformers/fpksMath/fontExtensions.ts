// @ts-nocheck
// Font extensions and typography post-filter of the vault's Obsidian plugin
// `.obsidian/plugins/mathjax4-pagella/main.js` (0.3.5), copied unchanged so the site
// and the vault set formulas identically. Update it from there, not by hand.
// `hybrid-font-data.json` is that plugin's `vendor/hybrid-font-data.json`.

export const SCRIPT_COMMA_SPACING = "0.167em"
const STIX_PIPE_EXTENSION_NAME = "fpks-stix2-pipe"

function startsWithExplicitSpace(node) {
  // TeX wraps \, and \! in mstyle when they occur in a script. Check the
  // parsed node rather than matching TeX text, so grouped/macros spaces work.
  while (
    node &&
    ["mstyle", "mrow", "inferredMrow", "TeXAtom"].includes(node.kind)
  ) {
    node = node.childNodes[0];
  }
  return node?.kind === "mspace";
}

export function spaceScriptCommas({ data }) {
  for (const comma of data.getList("mo")) {
    if (
      comma.getText() !== "," ||
      comma.attributes.get("scriptlevel") <= 0 ||
      comma.attributes.hasExplicit("rspace")
    ) continue;

    const siblings = comma.parent?.childNodes || [];
    const next = siblings[siblings.indexOf(comma) + 1];
    // A grouped {,}, a final comma, and explicit manual spacing stay intact.
    if (!next || startsWithExplicitSpace(next) || next.texClass === 5) continue;
    comma.attributes.set("rspace", SCRIPT_COMMA_SPACING);
  }
}

export function createStixPipeExtension(fontURL) {
  return {
    name: STIX_PIPE_EXTENSION_NAME,
    fontURL,
    fonts: ["MJX-STX-N"],
    chars: {
      normal: {
        // Exact MathJax-STIX2 4.1.3 CHTML metrics: height, depth, advance.
        0x007c: [0.706, 0.22, 0.267, { ff: "STX-N" }],
        0x2020: [0.692, 0.153, 0.512, { ff: "STX-N" }],
        0x2223: [0.706, 0.194, 0.272, { ff: "STX-N" }],
      },
    },
  };
}

function withFont(chars, ff) {
  return Object.fromEntries(
    Object.entries(chars).map(([codepoint, [h, d, w, options]]) => [
      codepoint,
      [h, d, w, { ...options, ff }],
    ]),
  );
}

export function createHybridExtension(key, source, fontURL, sizeVariants, stretchVariants) {
  const privateName = (name) => `-fpks-${key}-${name.replace(/^-/, "")}`;
  const available = new Set(Object.keys(source.privateVariants));
  const sourceSizes = source.sourceSizeVariants.map(privateName);
  const sourceStretches = source.sourceStretchVariants.map(privateName);
  const addedSizes = sourceSizes.filter((name) =>
    available.has(name) && !sizeVariants.includes(name)
  );
  const addedStretches = sourceStretches.filter((name) =>
    available.has(name) && !stretchVariants.includes(name)
  );
  const sizes = [...sizeVariants, ...addedSizes];
  const stretches = [...stretchVariants, ...addedStretches];
  const sizeIndex = (sourceIndex) => sizes.indexOf(sourceSizes[sourceIndex]);
  const stretchIndex = (sourceIndex) =>
    stretches.indexOf(sourceStretches[sourceIndex]);
  const delimiters = {};

  for (const [codepoint, original] of Object.entries(source.delimiters)) {
    const delimiter = structuredClone(original);
    if (delimiter.sizes) {
      delimiter.variants = delimiter.sizes.map((_, index) =>
        sizeIndex(original.variants?.[index] ?? index)
      );
      if (delimiter.variants.includes(-1)) {
        throw new Error(`Missing ${key} size variant for U+${Number(codepoint).toString(16)}`);
      }
    }
    if (delimiter.stretch) {
      delimiter.stretchv = delimiter.stretch.map((_, index) =>
        stretchIndex(original.stretchv?.[index] ?? 0)
      );
      if (delimiter.stretchv.includes(-1)) {
        throw new Error(`Missing ${key} stretch variant for U+${Number(codepoint).toString(16)}`);
      }
    }
    delimiters[codepoint] = delimiter;
  }

  const knownNames = new Set([...sizeVariants, ...stretchVariants]);
  return {
    name: `fpks-hybrid-${key}`,
    fontURL,
    fonts: source.faces.map((face) => `MJX-${face}`),
    variants: {
      "[+]": [...available].filter((name) => !knownNames.has(name))
        .map((name) => [name]),
    },
    sizeVariants: { "[+]": addedSizes },
    stretchVariants: { "[+]": addedStretches },
    chars: structuredClone(source.chars),
    delimiters,
  };
}

export function createVectorAccentExtension(fontURL) {
  // Pagella 4.1.3's upright combining arrow has dx=.937, sk=.687.
  // Its oversized attachment box adds .383em before the base in a\vec{a}a.
  // Use the bundled italic accent face and its exact upstream metrics instead.
  // Leave the stretchy arrow sizes/pieces and bold variants untouched.
  return {
    name: "fpks-pagella-vector-accent",
    fontURL,
    fonts: ["MJX-GP-ACI"],
    chars: {
      normal: {
        0x20d7: [0.796, -0.556, 0, { dx: 0.222, ff: "GP-ACI" }],
      },
    },
  };
}

export function createLadrTermesExtension(fontURL) {
  return {
    name: "fpks-ladr-termes",
    fontURL,
    fonts: ["MJX-GT-N"],
    chars: {
      normal: withFont({
        0x002b: [0.5, 0, 0.66],
        0x002c: [0.102, 0.141, 0.25],
        0x003b: [0.459, 0.141, 0.278],
      }, "GT-N"),
    },
  };
}

export function createLadrModernExtension(fontURL, sizeVariants, stretchVariants) {
  // Exact @mathjax/mathjax-modern-font 4.1.3 CHTML data (Latin Modern).
  // Private variants keep the shared Pagella extenders, notably U+005F,
  // intact for overbraces, brackets, arrows and other untargeted delimiters.
  const pieces = {
    N: {
      0x221a: [0.04, 0.96, 0.833, { ic: 0.02 }],
      0x23b7: [1.82, 0, 1.056],
      0x23df: [-0.109, 0.353, 0.492],
    },
    SO: {
      0x221a: [0.85, 0.35, 1, { ic: 0.02 }],
      0x23df: [-0.079, 0.385, 0.993],
    },
    LO: {
      0x221a: [1.15, 0.65, 1, { ic: 0.02 }],
      0x23df: [-0.078, 0.387, 1.494],
    },
    S3: {
      0x221a: [1.45, 0.95, 1, { ic: 0.02 }],
      0x23df: [-0.075, 0.394, 1.996],
    },
    S4: {
      0x221a: [1.75, 1.25, 1, { ic: 0.02 }],
      0x23df: [-0.071, 0.402, 2.498],
    },
    S5: { 0x23df: [-0.07, 0.408, 3] },
    S6: { 0x23df: [-0.067, 0.414, 3.502] },
    S7: { 0x23df: [-0.062, 0.423, 4.006] },
    EM: {
      0x005f: [-0.192, 0.294, 0.994],
      0x221a: [0.64, 0, 1.056],
      0x23df: [-0.192, 0.423, 2.003],
    },
    LT: {
      0x221a: [0.62, 0, 1.056, { ic: 0.02 }],
      0x23df: [-0.062, 0.294, 1.002],
    },
    RB: { 0x23df: [-0.062, 0.294, 1.001] },
  };
  const variantName = (suffix) => `-fpks-mm-${suffix.toLowerCase()}`;
  const sizeNames = ["N", "SO", "LO", "S3", "S4", "S5", "S6", "S7"]
    .map(variantName);
  const stretchNames = ["N", "EM", "LT", "RB"].map(variantName);
  const newSizes = sizeNames.filter((name) => !sizeVariants.includes(name));
  const newStretches = stretchNames.filter((name) => !stretchVariants.includes(name));
  const sizes = [...sizeVariants, ...newSizes];
  const stretches = [...stretchVariants, ...newStretches];
  const sizeIndex = (suffix) => sizes.indexOf(variantName(suffix));
  const stretchIndex = (suffix) => stretches.indexOf(variantName(suffix));

  return {
    name: "fpks-ladr-modern",
    fontURL,
    fonts: [...Object.keys(pieces), "C"].map((suffix) => `MJX-MM-${suffix}`),
    // Compute indices for each destination separately. A future CHTML font
    // instance may inherit the class extension already; do not append duplicate
    // variants or recreate them and discard their existing character data.
    variants: {
      "[+]": Object.keys(pieces).map(variantName)
        .filter((name) => !sizeVariants.includes(name) && !stretchVariants.includes(name))
        .map((name) => [name]),
    },
    sizeVariants: { "[+]": newSizes },
    stretchVariants: { "[+]": newStretches },
    chars: {
      normal: withFont({
        // Remap the displayed character, not TeX's ORD/PUNCT/REL class.
        // This covers literal ':' and \\colon without changing their spacing.
        0x003a: [0.422, -0.078, 0.278, { c: "∶" }],
        0x2217: [0.462, -0.039, 0.5, { sk: 0.251 }],
        0x221a: pieces.N[0x221a],
        0x2236: [0.422, -0.078, 0.278],
        0x23df: pieces.N[0x23df],
      }, "MM-N"),
      "-tex-calligraphic": withFont({
        0x41: [0.694, 0.015, 0.857, { sk: -0.212 }],
        0x42: [0.712, 0.001, 0.778, { sk: -0.163 }],
        0x43: [0.697, 0.015, 0.654, { sk: -0.172 }],
        0x44: [0.716, -0.004, 0.871, { sk: -0.154 }],
        0x45: [0.702, 0.012, 0.613, { sk: -0.057 }],
        0x46: [0.699, 0.015, 0.904, { sk: -0.08 }],
        0x47: [0.697, 0.13, 0.685, { sk: -0.099 }],
        0x48: [0.69, 0.008, 1.065, { sk: -0.281 }],
        0x49: [0.685, 0.014, 0.62, { sk: -0.068 }],
        0x4a: [0.692, 0.129, 0.698, { sk: -0.059 }],
        0x4b: [0.69, 0.012, 0.989, { sk: -0.181 }],
        0x4c: [0.685, 0.007, 0.77, { sk: -0.049 }],
        0x4d: [0.699, 0.013, 1.149, { sk: -0.145 }],
        0x4e: [0.706, 0.007, 1.007, { sk: -0.075 }],
        0x4f: [0.686, 0.018, 0.699, { sk: 0.017 }],
        0x50: [0.71, 0.011, 0.763, { sk: -0.111 }],
        0x51: [0.694, 0.024, 0.716, { sk: 0.011 }],
        0x52: [0.712, 0.006, 0.818, { sk: -0.021 }],
        0x53: [0.702, 0.012, 0.625, { sk: 0.083 }],
        0x54: [0.693, 0.006, 0.776, { sk: -0.119 }],
        0x55: [0.699, 0.016, 0.744, { sk: -0.094 }],
        0x56: [0.709, 0.009, 0.71, { sk: -0.049 }],
        0x57: [0.702, 0.005, 1.028, { sk: -0.245 }],
        0x58: [0.706, 0.009, 0.87, { sk: -0.017 }],
        0x59: [0.702, 0.136, 0.628, { sk: 0.144 }],
        0x5a: [0.696, 0.011, 0.726, { sk: 0.034 }],
      }, "MM-C"),
      ...Object.fromEntries(Object.entries(pieces).map(([suffix, chars]) => [
        variantName(suffix), withFont(chars, `MM-${suffix}`),
      ])),
    },
    delimiters: {
      0x221a: {
        dir: "v",
        sizes: [1.001, 1.201, 1.801, 2.401, 3.001],
        variants: ["N", "SO", "LO", "S3", "S4"].map(sizeIndex),
        stretch: [0x221a, 0x221a, 0x23b7],
        stretchv: ["LT", "EM", "N"].map(stretchIndex),
        HDW: [0.04, 0.96, 1.056],
        fullExt: [0.64, 2.44],
      },
      0x23df: {
        dir: "h",
        sizes: [0.492, 0.993, 1.494, 1.996, 2.498, 3, 3.502, 4.006],
        variants: sizeNames.map((name) => sizes.indexOf(name)),
        stretch: [0x23df, 0x005f, 0x23df, 0x23df],
        stretchv: ["LT", "EM", "RB", "EM"].map(stretchIndex),
        HDW: [-0.062, 0.423, 0.492],
        hd: [-0.192, 0.294],
      },
    },
  };
}
