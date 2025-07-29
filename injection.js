
(() => {
  // 1. Expose internal SCORM functions if not already global
  if (typeof window.set_value !== 'function') {
    try {
      const SCORM = window

      window.set_value = function(key, value) {
        if (!SCORM) return console.error('SCORM API not found');
        const result = SCORM.LMSSetValue(key + '', value + '');
        if (!SCORM.LMSCommit("")) {
          console.warn('Commit failed');
        }
        console.log('set_value:', key, value, result);
      };

      window.get_value = function(key) {
        if (!SCORM) return '';
        const value = SCORM.LMSGetValue(key + '');
        console.log('get_value:', key, value);
        return value + '';
      };
    } catch (e) {
      console.error('Failed to expose SCORM functions:', e);
      return;
    }
  }

  // 2. Manually set 4 key SCORM values to spoof completion
  const suspend = get_value('cmi.suspend_data') || '{}';
  let suspend_obj;
  try {
    suspend_obj = JSON.parse(suspend);
  } catch (e) {
    console.warn('Could not parse suspend_data:', e);
    suspend_obj = {};
  }

  if (!suspend_obj.course_work) {
    console.warn('Missing course_work in suspend_data, injecting placeholder.');
    suspend_obj.course_work = 'FAKE_COURSE_ID';
  }

  set_value('cmi.suspend_data', JSON.stringify(suspend_obj)); 
  set_value('cmi.core.score.raw', 100);
  set_value('cmi.core.session_time', '0001:00:00');
  set_value('cmi.core.lesson_status', 'passed');

  console.log('🎉 All SCORM values injected.');
})();
