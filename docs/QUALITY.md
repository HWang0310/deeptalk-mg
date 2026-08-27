# Quality Model

## Machine QA

Machine QA fails closed when an expected artifact is missing, an MP4 cannot be decoded, dimensions are not 1920×1080, frame rate is not 30fps, duration is outside one frame of the declared duration, output hash is missing, or any declared still is missing.

The source validator also rejects unknown profile/grammar combinations, empty primary judgment, unsupported element counts, invalid number/unit pairs, duplicate ids, and text that cannot fit the role's bounded lines without clipping.

## Human visual review

Each scene receives a 1–5 score and a brief evidence note for:

- composition and whitespace;
- Chinese typography and line breaks;
- visual hierarchy and time-to-primary-judgment;
- information density and progressive disclosure;
- grammar-to-meaning fit;
- easing and transition rhythm;
- art direction and avoidance of template feeling.

A V0 scene is a design candidate only when machine QA passes and no human category scores below 3. Scores are evidence for R&D, not an automatic production gate.

