/* data.js - English Test for Telem, student content only, organised for the wizard.

   Source: the teacher's copy (telem teachers guide.pdf). Left out on purpose, so nothing here can
   reach the student: the answer key (bold / circled / highlighted answers), points and scoring rules,
   the red teacher notes, the Hebrew "מטלה זו מעריכה" notes, and the words / questions the teacher
   reads aloud in Task A (they would turn listening into reading).
   "Circle" / "Tick" in the paper instructions became "Choose", since the student clicks.

   Hierarchy
     stages  -> the 5 wizard steps the student sees in the stepper (a UI grouping only)
     groups  -> one question set from the paper (keeps its place in the paper in `source`).
                The local counter ("מילה 2 מתוך 5") counts the units of one group.
     units   -> one screen = one unit of progress. Items shown together on one screen
                (the 5 feelings statements, two "When will they eat?" answers...) are ONE unit.

   Versions A / B
     The paper has Row A and Row B for some questions: alternative versions, not extra steps.
     `units` is either a list, or { A: [...], B: [...] }. ASSESSMENT.variant picks one
     (or ?variant=B in the URL). Only Amir's note has Row B in the teacher's copy; every other
     group falls back to A.

   Unit types
     likert     several statements, each with its own scale, on one screen     items[]
     choice     pick one option                                                 options[], prompt?, word?
     truefalse  True / False                                                    statement
     short      one-line answer                                                 prompt?, word?, lang
     fields     several labelled one-line answers (an example row is locked)    fields[]
     complete   finish a sentence                                               stem
     composite  dependent parts on one screen                                   parts[]
     long       a few lines of free text                                        prompt, lang
     writing    the writing task, with a word count                             brief, words

   Stage fields
     title, icon (a DS icon), summary (the stage intro)

   Group fields
     label       short Hebrew name (stage intro list, "unanswered" list at the end)
     instruction { en, he }  shown on every screen of the group (a unit can override it)
     counter     noun for the local counter, or null when the group is one screen
     example     a locked, worked example shown under the instruction
     material    source text kept beside the questions (two-column layout)
     audio       true: the teacher reads aloud. `src` per unit, null = no recording yet (demo mode)
     hint        a short student tip */

window.ASSESSMENT = {
  id: 'telem-english',
  title: { he: 'שאלון אנגלית', en: 'English Test for Telem' },
  variant: 'A',

  // Part I / Part II rules from the paper. A stage with `part` shows its rule.
  dictionary: {
    I: { allowed: false, he: 'אין להשתמש במילון', en: 'You may NOT use your dictionary' },
    II: { allowed: true, he: 'מותר להשתמש במילון', en: 'You MAY use your dictionary' },
  },

  stages: [
    // ---------------------------------------------------------------- 1. היכרות
    {
      id: 'intro',
      title: 'היכרות',
      icon: 'emoji',
      summary: 'כמה שאלות קצרות על התחושות שלך לגבי אנגלית. אין כאן תשובות נכונות או לא נכונות.',
      groups: [
        {
          id: 'feelings', label: 'שאלון התחושות',
          source: { section: 'How do you feel about English?' },
          dir: 'rtl',
          counter: null,
          instruction: { he: 'איך את/ה מרגיש/ה לגבי לימודי האנגלית?', en: 'How do you feel about English?' },
          units: [
            {
              id: 'feelings',
              type: 'likert',
              items: [
                { id: 'a', text: 'אני טוב/ה באנגלית', options: ['כן', 'בערך', 'לא כל כך', 'לא'] },
                { id: 'b', text: 'אני בדרך כלל נהנה/נהנית משיעורי אנגלית', options: ['כן', 'בערך', 'לא כל כך', 'לא'] },
                { id: 'c', text: 'אני מרגיש/ה שאני זקוק/ה לעזרה באנגלית', options: ['כן', 'לא'] },
                { id: 'd', text: 'אני יותר טוב/ה בעל פה מאשר בקריאה וכתיבה', options: ['כן', 'בערך', 'לא כל כך', 'לא'] },
                { id: 'e', text: 'חשוב לי להצליח באנגלית', options: ['כן', 'בערך', 'לא כל כך', 'לא'] },
              ],
            },
          ],
        },
      ],
    },

    // ---------------------------------------------------------------- 2. האזנה (Part I, Task A, Q1-2)
    {
      id: 'listening',
      title: 'האזנה',
      icon: 'speaker',
      part: 'I',
      summary: 'המורה מקריא/ה מילים ושואל/ת שאלות באנגלית. מקשיבים ועונים.',
      groups: [
        {
          id: 'listen-words', label: 'בחירת המילה ששומעים',
          source: { part: 'I', task: 'A', question: 1 },
          counter: 'מילה',
          audio: true,
          instruction: { en: 'Choose the word that your teacher reads.', he: 'בחר/י את המילה שהמורה שלך מקריא/ה.' },
          example: { type: 'choice', options: ['fan', 'pan', 'tan'], selected: 'pan' },
          units: [
            { id: 'w1', type: 'choice', audio: { src: null }, options: ['card', 'car', 'care'] },
            { id: 'w2', type: 'choice', audio: { src: null }, options: ['use', 'nice', 'nose'] },
            { id: 'w3', type: 'choice', audio: { src: null }, options: ['by', 'day', 'play'] },
            { id: 'w4', type: 'choice', audio: { src: null }, options: ['now', 'how', 'know'] },
            { id: 'w5', type: 'choice', audio: { src: null }, options: ['small', 'mall', 'smile'] },
          ],
        },
        {
          id: 'listen-questions', label: 'תשובות לשאלות המורה',
          source: { part: 'I', task: 'A', question: 2 },
          counter: 'שאלה',
          audio: true,
          instruction: { en: 'Write the answers to the questions your teacher asks.', he: 'כתוב/כתבי את התשובות לשאלות שהמורה שלך שואל/ת.' },
          hint: 'כדאי לענות באנגלית. אם קשה, אפשר לענות גם בעברית.',
          units: [
            { id: 'l1', type: 'short', audio: { src: null }, lang: 'any' },
            { id: 'l2', type: 'short', audio: { src: null }, lang: 'any' },
            { id: 'l3', type: 'short', audio: { src: null }, lang: 'any' },
            { id: 'l4', type: 'short', audio: { src: null }, lang: 'any' },
            { id: 'l5', type: 'short', audio: { src: null }, lang: 'any' },
          ],
        },
      ],
    },

    // ---------------------------------------------------------------- 3. קריאה בסיסית (Part I, Task B, Q3-5)
    {
      id: 'reading',
      title: 'קריאה בסיסית',
      icon: 'text',
      part: 'I',
      summary: 'קוראים מילים, פתק קצר ושורות של מילים, ועונים.',
      groups: [
        {
          id: 'word-meaning', label: 'פירוש מילים',
          source: { part: 'I', task: 'B', question: 3 },
          counter: 'מילה',
          instruction: { en: 'Write the meaning of the word.', he: 'כתוב/כתבי את פירוש המילה.' },
          units: [
            { id: 'm1', type: 'short', word: 'radio', lang: 'he' },
            { id: 'm2', type: 'short', word: 'sandal', lang: 'he' },
            { id: 'm3', type: 'short', word: 'disc', lang: 'he' },
            { id: 'm4', type: 'short', word: 'zebra', lang: 'he' },
            { id: 'm5', type: 'short', word: 'cola', lang: 'he' },
          ],
        },
        {
          id: 'amir-note', label: 'הפתק של אמיר',
          source: { part: 'I', task: 'B', question: 4 },
          counter: 'משפט',
          instruction: { en: 'Read the note that Amir wrote. Is the sentence true or false?', he: 'קרא/י את הפתק שכתב אמיר. האם המשפט נכון או לא נכון?' },
          example: { type: 'truefalse', statement: 'Rami is having a party.', selected: 'false' },
          material: {
            kind: 'note',
            title: "Amir's note",
            html: `
              <p>Hi Mom,</p>
              <p>Rami and I are going to Dana's house. She is having a party. I hope it will be fun.
                 Don't wait for me. I may come home late. You can call me on my cellphone.</p>
              <p>Love,<br>Amir</p>`,
          },
          units: {
            A: [
              { id: 'dana-party', type: 'truefalse', statement: 'Dana is having a party.' },
              { id: 'with-dana', type: 'truefalse', statement: 'Amir is going to the party with Dana.' },
              { id: 'home-late', type: 'truefalse', statement: 'Amir may come home late.' },
              { id: 'dana-fun', type: 'truefalse', statement: 'Dana hopes she will have fun.' },
              { id: 'cellphone', type: 'truefalse', statement: 'Amir forgot his cellphone.' },
            ],
            B: [
              { id: 'with-dana', type: 'truefalse', statement: 'Amir is going to the party with Dana.' },
              { id: 'dana-party', type: 'truefalse', statement: 'Dana is having a party.' },
              { id: 'dana-fun', type: 'truefalse', statement: 'Dana hopes she will have fun.' },
              { id: 'home-late', type: 'truefalse', statement: 'Amir may come home late.' },
              { id: 'cellphone', type: 'truefalse', statement: 'Amir forgot his cellphone.' },
            ],
          },
        },
        {
          id: 'odd-one-out', label: 'המילה שאינה שייכת',
          source: { part: 'I', task: 'B', question: 5 },
          counter: 'שורה',
          instruction: { en: "Choose the word that doesn't belong.", he: 'בחר/י את המילה שאינה שייכת.' },
          example: { type: 'choice', options: ['mother', 'father', 'banana', 'sister'], selected: 'banana' },
          units: [
            { id: 'o1', type: 'choice', options: ['school', 'class', 'dog', 'teacher'] },
            { id: 'o2', type: 'choice', options: ['car', 'house', 'bicycle', 'bus'] },
            { id: 'o3', type: 'choice', options: ['banana', 'black', 'red', 'green'] },
            { id: 'o4', type: 'choice', options: ['fat', 'tall', 'short', 'book'] },
            { id: 'o5', type: 'choice', options: ['shoes', 'newspaper', 'shirt', 'jeans'] },
          ],
        },
      ],
    },

    // ---------------------------------------------------------------- 4. הבנת הנקרא (Part II, Q6-7)
    {
      id: 'comprehension',
      title: 'הבנת הנקרא',
      icon: 'document',
      part: 'II',
      summary: 'קוראים לוח זמנים וטקסט על קואלות. הטקסט נשאר לידך בזמן שעונים.',
      groups: [
        {
          id: 'timetable', label: 'לוח הזמנים',
          source: { part: 'II', question: 6 },
          counter: 'שאלה',
          instruction: { en: 'Read the timetable and answer the questions according to the text.', he: 'עיין/י בלוח הזמנים וענה/י על השאלות על פי הטקסט.' },
          material: {
            kind: 'timetable',
            title: 'A Visit to the Television Studio',
            rows: [
              ['8:30 - 10:30', 'Leave the school for Jerusalem. Short stop for breakfast at a picnic area.'],
              ['10:30 - 12:30', 'Short tour of the studio. Meet two news reporters who will explain how they collect news reports from the field.'],
              ['12:30 - 13:00', 'Lunch'],
              ['13:00 - 15:00', 'Meet the camera team and learn how the news is filmed.'],
              ['15:00 - 16:00', 'Watch a live broadcast*.'],
              ['17:00', 'Back to school.'],
            ],
            glossary: [['*broadcast', 'שידור, משדר']],
          },
          units: [
            {
              id: 't1', type: 'choice',
              instruction: { en: 'Choose the correct answer.', he: 'בחר/י את התשובה הנכונה.' },
              prompt: 'What is the text about?',
              options: ['a school trip', 'a television program about Jerusalem', 'a trip for pupils and parents', 'English program for pupils'],
            },
            {
              id: 't2', type: 'choice',
              instruction: { en: 'Choose the correct answer.', he: 'בחר/י את התשובה הנכונה.' },
              prompt: 'What time do pupils begin their visit at the studio?',
              options: ['8:30', '10:30', '12:30', '17:00'],
            },
            {
              id: 't3', type: 'fields',
              instruction: { en: 'Write TWO answers.', he: 'כתוב/כתבי שתי תשובות לשאלה.' },
              prompt: 'When will they eat?',
              fields: [{ id: 'a', label: 'a.' }, { id: 'b', label: 'b.' }],
            },
            {
              id: 't4', type: 'short', lang: 'en',
              instruction: { en: 'Write the answer.', he: 'ענה/י על השאלה.' },
              prompt: 'What will the pupils learn from the camera team?',
            },
          ],
        },
        {
          id: 'koalas', label: 'הטקסט על הקואלות',
          source: { part: 'II', question: 7 },
          counter: 'שאלה',
          instruction: { en: 'Read the text and answer the questions.', he: 'קרא/י את הטקסט וענה/י על השאלות.' },
          material: {
            kind: 'article',
            title: 'Koalas',
            html: `
              <img class="wz-figure wz-figure-start" src="assets/koala.jpg" width="236" height="307" alt="A koala sitting in a tree">
              <p>Koalas are animals that live in Australia. Many people call them 'koala bears' but this is not
                 correct. Koalas are not bears. They are marsupials.</p>
              <p><em>Marsupials</em> are animals that have a pouch*, or pocket, where they keep their babies.
                 Mother kangaroos and koalas keep their babies in their pouch for six or seven months.</p>
              <h3>What do koalas look like?</h3>
              <p>Koalas have gray and white fur, round ears and a black nose. Adult koalas weigh about
                 12 kilograms and are about one meter tall.</p>
              <h3>Where do koalas live?</h3>
              <img class="wz-figure wz-figure-end" src="assets/australia-map.png" width="297" height="273"
                   alt="Map of Australia. The gray areas, where most koalas live, run along the east and south-east coast.">
              <p>Koalas come from Australia. The gray areas on the map show where most koalas live.</p>
              <h3>What do koalas eat?</h3>
              <p>Koalas only eat the leaves of eucalyptus trees**. These leaves are full of water. When koalas eat
                 the leaves, they get most of the water that they need.</p>
              <h3>How do koalas spend their time?</h3>
              <p>Koalas sleep for about 18-20 hours each day. They are awake mainly at night, when they spend most
                 of their time eating. Koalas do not live in groups. They prefer to live alone.</p>
              <h3>How many koalas live in Australia?</h3>
              <p>In the past, millions of koalas lived in Australia. However, for many years koalas were killed for
                 their fur. Today there are only a few thousand left. Therefore, koalas are a protected species***.
                 That means they must not be hurt or killed.</p>`,
            glossary: [['*pouch', 'כיס'], ['**eucalyptus trees', 'עצי איקליפטוס'], ['***protected species', 'סוג בעל חיים המוגדר מוגן']],
          },
          units: [
            {
              id: 'k1', type: 'choice',
              instruction: { en: 'Choose the correct answer.', he: 'בחר/י את התשובה הנכונה.' },
              prompt: 'A <em>marsupial</em> is _____.',
              options: ['an area in Australia', 'an animal with a pouch', 'a kind of Australian tree', 'a family of bears'],
            },
            {
              id: 'k2', type: 'short', lang: 'en',
              instruction: { en: 'Answer the question.', he: 'ענה/י על השאלה.' },
              prompt: 'Where does a baby koala spend the first months of its life?',
            },
            {
              id: 'k3', type: 'fields',
              instruction: { en: 'Complete the facts about koalas.', he: 'השלם/השלימי את הפרטים על הקואלות.' },
              prompt: 'Koala facts',
              fields: [
                { id: 'name', label: 'Name:', example: 'koala' },
                { id: 'fur', label: 'Fur color:' },
                { id: 'weight', label: 'Weight:' },
              ],
            },
            {
              id: 'k4', type: 'truefalse',
              instruction: { en: 'Choose TRUE or FALSE.', he: 'בחר/י נכון או לא נכון.' },
              statement: 'Koalas live all over Australia.',
            },
            {
              id: 'k5', type: 'complete',
              instruction: { en: 'Complete the sentence.', he: 'השלם/השלימי את המשפט.' },
              stem: "Koalas don't drink a lot of water because",
            },
            {
              id: 'k6', type: 'composite',
              instruction: { en: 'Answer both parts of the question.', he: 'ענה/י על שני חלקי השאלה.' },
              parts: [
                { id: 'a', label: 'a.', type: 'truefalse', prompt: 'Choose TRUE or FALSE:', statement: 'Koalas sleep a lot.' },
                { id: 'b', label: 'b.', type: 'long', lang: 'en', prompt: 'Copy the sentence that proves (מוכיח) your answer.' },
              ],
            },
            {
              id: 'k7', type: 'short', lang: 'en',
              instruction: { en: 'Answer the question.', he: 'ענה/י על השאלה.' },
              prompt: 'How many koalas used to live in Australia?',
            },
            {
              id: 'k8', type: 'short', lang: 'en',
              instruction: { en: 'Answer the question.', he: 'ענה/י על השאלה.' },
              prompt: 'How many koalas are there in Australia today?',
            },
            {
              id: 'k9', type: 'complete',
              instruction: { en: 'Complete the sentence.', he: 'השלם/השלימי את המשפט.' },
              stem: 'Koalas cannot be killed because',
            },
            {
              id: 'k10', type: 'long', lang: 'he',
              instruction: { en: 'Answer in Hebrew.', he: 'ענה/י בעברית על השאלה.' },
              prompt: 'What new information did you learn from the text?',
            },
            {
              id: 'k11', type: 'long', lang: 'he',
              instruction: { en: 'Answer in Hebrew.', he: 'ענה/י בעברית על השאלה.' },
              prompt: 'What else would you like to know about animals in Australia?',
            },
          ],
        },
      ],
    },

    // ---------------------------------------------------------------- 5. כתיבה (Task C)
    {
      id: 'writing',
      title: 'כתיבה',
      icon: 'edit',
      summary: 'כותבים פתק קצר באנגלית לחבר/ה.',
      groups: [
        {
          id: 'sick-friend', label: 'פתק לחבר/ה חולה',
          source: { task: 'C' },
          counter: null,
          instruction: { en: 'Write a note to your friend.', he: 'כתוב/כתבי פתק לחבר/ה.' },
          units: [
            {
              id: 'note',
              type: 'writing',
              words: [25, 35],
              placeholder: 'Dear ...',
              brief: {
                en: `<p>Your friend is sick and did not come to school today. Write him/her a note.</p>
                     <p>You may write about:</p>
                     <ol type="a"><li>what you learned</li><li>what you did</li><li>your homework for tomorrow</li>
                     <li>don't forget to ask your friend how he or she is feeling</li></ol>
                     <p>Write 25 - 35 words. Please write clearly.</p>`,
                he: `<p>החבר/ה שלך חולה ולא הגיע/ה לבית הספר היום. כתוב/כתבי לו/לה פתק.</p>
                     <p>אפשר לכתוב על:</p>
                     <ol class="wz-list-he"><li>מה שלמדת</li><li>מה שעשית</li><li>שיעורי הבית למחר</li>
                     <li>לא לשכוח לשאול לשלומו/ה</li></ol>
                     <p>כתוב/כתבי 25 - 35 מילים. אנא כתוב/כתבי בצורה ברורה.</p>`,
              },
            },
          ],
        },
      ],
    },

    // ---------------------------------------------------------------- 6. דיבור (Oral Assessment)
    {
      id: 'speaking',
      title: 'דיבור',
      icon: 'microphone',
      summary: 'הסתכלו בתמונה וענו באנגלית על 5 שאלות בעל פה.',
      groups: [
        {
          id: 'oral',
          label: 'משימת דיבור',
          source: { section: 'Oral Assessment' },
          counter: 'שאלה',
          instruction: {
            en: 'Look at the picture and answer the following questions.\nanswer each question orally in English.',
            he: 'הסתכלו בתמונה וענו על שאלות 1-5.\nתוכלו להקשיב או לקרוא את השאלה בעצמכם. ענו באנגלית',
          },
          guidelines: [
            { he: 'הקפידו לדבר באופן ברור', en: 'Take your time and speak clearly.' },
            { he: 'וודאו שהתשובה שלכם מתאימה לשאלה', en: 'Make sure you answer the question and your meaning is clear.' },
            { he: 'ניתן לעשות תיקון עצמי תוך כדי דיבור, או לחזור במילים אחרות', en: 'You may correct yourself as you speak, or repeat what you said in different words.' },
          ],
          picture: 'assets/park-picnic.png',
          units: [
            { id: 'oral-1', type: 'oral', prompt: 'What is the weather in the park?' },
            { id: 'oral-2', type: 'oral', prompt: 'Where is the man reading the book?' },
            { id: 'oral-3', type: 'oral', prompt: 'Who has the balloon?' },
            { id: 'oral-4', type: 'oral', prompt: 'Tell two things about the bag in the picture.' },
            { id: 'oral-5', type: 'oral', prompt: 'What do you think the kids will do when they finish eating?' },
          ],
        },
      ],
    },
  ],
};
