// ============================================================================
// EDITABLE AI MODELS FALLBACK CHAIN (§10.5)
// Ordered with the fastest production Gemini Flash models first for instant streaming.
// ============================================================================

export const AI_MODELS = {
  withVision: ['gemini-3-flash-preview', 'gemini-2.5-flash', 'gemini-flash-latest'],
  followUp: ['gemini-3-flash-preview', 'gemini-2.5-flash', 'gemini-flash-latest'],
  initialExplanation: ['gemini-3-flash-preview', 'gemini-2.5-flash', 'gemini-flash-latest']
};

export const THINKING_LEVEL_SUPPORTED_MODELS = new Set([
  'gemini-3-flash-preview',
  'gemini-3.1-pro-preview'
]);
