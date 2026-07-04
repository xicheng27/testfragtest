export type AnalyticsEvent =
  | 'landing_view'
  | 'quiz_start'
  | 'quiz_question_view'
  | 'quiz_answer_select'
  | 'quiz_back'
  | 'quiz_skip'
  | 'quiz_complete'
  | 'results_view'
  | 'result_save_to_shelf'
  | 'result_view_official_product'
  | 'result_feedback_not_my_vibe'
  | 'results_filter_change'
  | 'quiz_retake'
  | 'shelf_view'
  | 'signup_prompt_view'
  | 'signup_start'
  | 'signup_complete';

export function trackEvent(event: AnalyticsEvent, properties: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent('scentmatch:analytics', {
    detail: { event, properties, timestamp: new Date().toISOString() },
  }));

  if (process.env.NODE_ENV === 'development') {
    console.info('[ScentMatch analytics]', event, properties);
  }
}
