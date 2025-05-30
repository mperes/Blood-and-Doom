const addFixedRow = (name:string, rows:number) => {
  if(!spine.fixedRepeatingSections.some((s) => s.name === name)) return;
  const section = spine.fixedRepeatingSections.find((s) => s.name === name);
  const newIDs = Array.from({ length: rows }, (_, i) => generateRowID());
  const newAttrs: Record<string, string> = {};
  newIDs.forEach((id) => {
    section?.fields.forEach((field) => {
      newAttrs[`repeating_${section.name}_${id}_${field}`] = '';
    });
  });
  setAttrs(newAttrs, { silent: true });
};
on('sheet:opened', () => {
  spine.fixedRepeatingSections.forEach((section) => {
    getSectionIDs(section.name, (ids) => {
      const total = ids.length;
      const toAdd = section.fixed - total;
      if (toAdd <= 0) return;
      addFixedRow(section.name, toAdd);
    });
  });
});

spine.fixedRepeatingSections.forEach((section) => {
  on(`remove:repeating_${section.name}`, function(eventInfo) {
    addFixedRow(section.name, 1); 
  });
});

on('change:doom-points', eventinfo => {
  const newValue = eventinfo.newValue || '';
  setAttrs({'roll-doom-die':newValue})
});

['bruises', 'scrapes', 'wounds', 'injuries', 'madness'].forEach(bar => {
  on(`change:${bar}-max`, eventinfo => {
    getAttrs([bar], values => {
      const currentValue = values[bar] ? parseInt(values[bar]) : 0;
      const maxValue = eventinfo.newValue ? parseInt(eventinfo.newValue) : Infinity;
      if(currentValue > maxValue) {
        setAttrs({[bar]: String(maxValue)});
      }
    });
  });
});
['bruises', 'scrapes', 'wounds', 'injuries', 'madness', 'blood-points', 'momentum-pool', 'doom-points'].forEach(bar => {
  on(`change:${bar}`, eventinfo => {
    if(!eventinfo.sourceType || eventinfo.sourceType !== 'player') return;
    if((!eventinfo.newValue || eventinfo.newValue == '0') && (eventinfo.previousValue && eventinfo.previousValue !== '0')) {
      const previousValue = parseInt(eventinfo.previousValue);
      if(previousValue-1 > 0) {
        setAttrs({[bar]: String(previousValue-1)}, {silent:true});
      }
    }
  });
});