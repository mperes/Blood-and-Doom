type ActionRoll = 'successes' | 'difficulty' | 'setback' | 'extra_successes';

/**
* Start an Action Roll
* @param config Config object for the roll.
* @param callback Callback function which receives the roll results.
*/
function startActionRoll(
  {
    ability,
    difficulty,
    title,
    useExtra,
    template = 'ability',
    blind
  }: {
    ability: number;
    difficulty?: number;
    title?: string;
    useExtra?: boolean;
    template?: string;
    blind?: boolean;
  },
  callback?: RollCallback<ActionRoll>
) {
  if (!useExtra) {
    console.log(blind)
    myStartRoll(
      template,
      { title: title ?? 'Action Roll', charname: '@{character_name}' },
      {
        difficulty: `${difficulty ?? '1'}`,
        successes: `${ability}d10`,
        setback: '0',
        blind: blind ? '[[1]]' : '[[0]]'
      },
      callback as RollCallback<'difficulty' | 'successes' | 'setback' | 'blind'>
    );
  } else {
    myStartRoll(
      template,
      { title: title ?? 'Action Roll', charname: '@{character_name}' },
      {
        difficulty: `${difficulty ?? '1'}`,
        successes: `${ability}d10`,
        setback: '0',
        extra_successes: '0',
      },
      callback
    );
  }
}

/**
* Processes an action roll to give calculated number of successes, setback die, and extra successes
* @param results The raw results from an action roll
*/
function processActionRoll(results: RollResults<ActionRoll>): {
  [key in ActionRoll]: number;
} {
  const successes = results.successes.dice
  .map((d) => (d === 10 ? 2 : d > 7 ? 1 : (0 as number)))
  .reduce((a, b) => a + b, 0);
  return {
    successes,
    difficulty: results.difficulty.result,
    setback: results.successes.dice[0],
    extra_successes: successes - results.difficulty.result,
  };
}

/**
* Perform a full Action roll, start to finish
* @param ability number of ability dice to roll
* @param difficulty Difficulty of the roll, else uses set difficulty from sheet
* @param title Title of the roll in the template
* @param useExtra Whether to include Setback and extra successes
* @param save Whether to save the roll in the reroll buffer
* @param template the name of the roll template to use
*/
function rollActionDice(
  ability: number,
  difficulty?: number | undefined,
  title = 'Action Roll',
  useExtra = true,
  save = true,
  template = 'ability',
  blind = false
) {
  startActionRoll(
    { ability, difficulty, title, useExtra, template, blind },
    ({ rollId, results }) => {
      const finalResults = processActionRoll(results);
      finishRoll(rollId, finalResults);
      save &&
      setAttrs({
        last_roll: btoa(JSON.stringify(results)),
      });
    }
  );
}

const rollAction = (actionDice:number) => {
  getAttrs(['roll-difficulty'], values => {
    const difficulty = values['roll-difficulty'] ? parseInt(values['roll-difficulty']) || undefined : undefined;
    const useExtra = difficulty ? true : false;
    const blind = !useExtra;
    rollActionDice(
      actionDice,
      difficulty,
      undefined,
      useExtra,
      undefined,
      undefined,
      blind
    );
  });
};
for(let i=1; i<=10; i++) {
  on(`clicked:roll-action-dice-${i}`, () => {
    rollAction(i);
  });
}
on('change:roll-action-dice-others', eventinfo => {
  if(eventinfo.sourceType && eventinfo.sourceType==='player' && eventinfo.newValue) {
    rollAction(parseInt(eventinfo.newValue));
    setAttrs({['roll-action-dice-others']:''}, {silent:true});
  }
});

const rollDamage = (dieSize:string) => {
  getAttrs(['roll-damage-dice', 'roll-damage-bonus', 'roll-damage-bonus-enabled'], values => {
    const dice = values['roll-damage-dice'] ? values['roll-damage-dice'] === '0' ? '1' : values['roll-damage-dice'] : '1';
    const bonus = values['roll-damage-bonus-enabled'] && values['roll-damage-bonus-enabled'] === '1' && values['roll-damage-bonus'] ? values['roll-damage-bonus'].trim()[0] === '-' ? values['roll-damage-bonus'] : `+${values['roll-damage-bonus']}` : '';
    const damage = `${dice}${dieSize}${bonus}`
    myStartRoll(
      'damage',
      { title: 'DAMAGE', charname: '@{character_name}' },
      { damage: damage },
      ({ rollId, results }) => {
        finishRoll(rollId, {
          roll: results.damage.dice
          .sort()
          .filter((_, i) => i != 1)
          .reduce((a, b) => a + b, 0),
        });
      }
    );
  });
};
['1', 'd4', 'd6', 'd8', 'd10', 'd12'].forEach( die => {
  on(`clicked:roll-damage-die-size-${die}`, () => {
    const finalDie = die === '1' ? 'd1' : die;
    rollDamage(finalDie);
  });
});

['1', '2', '3', '4', '5', '6'].forEach( die => {
  on(`clicked:roll-doom-die-${die}`, () => {
    rollActionDice(
      parseInt(die),
      2,
      'Doom Roll',
      false,
      false,
      'doom'
    );
  });
});

on('clicked:repeating_weapon', eventinfo => {
  if(!eventinfo.sourceAttribute) return;
  const id = (eventinfo.sourceAttribute as string).replace('repeating_weapon_', '');
  getAttrs([`repeating_weapon_${id}_name`, `repeating_weapon_${id}_damage`], (values: { [key: string]: string }) => {
    const title = { title: 'DAMAGE', charname: '@{character_name}' };
    const titleWithSub = values[`repeating_weapon_${id}_name`] ? { ...title, dice: values[`repeating_weapon_${id}_name`] } : title;
    myStartRoll(
      'damage',
      titleWithSub,
      { damage: values[`repeating_weapon_${id}_damage`] || '[[0]]'},
      ({ rollId, results }) => {
        finishRoll(rollId, {
          roll: results.damage.dice
          .sort()
          .filter((_, i) => i != 1)
          .reduce((a, b) => a + b, 0),
        });
      }
    );
  });
});

on('clicked:roll-unarmed-damage', eventinfo => {
  console.log('1');
  getAttrs(['unarmed-attack-damage'], (values: { [key: string]: string }) => {
    const title = { title: 'DAMAGE', charname: '@{character_name}', dice: 'Unnarmed Attack'};
    myStartRoll(
      'damage',
      title,
      { damage: values['unarmed-attack-damage'] || '[[0]]'},
      ({ rollId, results }) => {
        finishRoll(rollId, {
          roll: results.damage.dice
          .sort()
          .filter((_, i) => i != 1)
          .reduce((a, b) => a + b, 0),
        });
      }
    );
  });
});
