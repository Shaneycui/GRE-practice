const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const zlib = require('node:zlib');

const html = fs.readFileSync('dist/index.html', 'utf8');
const content = JSON.parse(fs.readFileSync('content/questions-81-100.json', 'utf8'));
const keys = JSON.parse(fs.readFileSync('content/answer-key-user-provided.json', 'utf8')).sections;
const dictionary = JSON.parse(zlib.gunzipSync(Buffer.from(html.match(/id="gre-dictionary-data"[^>]*>([^<]+)/)[1], 'base64')));
const context = vm.createContext({window: {}});
for (const script of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (script[1].includes('application/octet-stream')) continue;
  const compiled = new vm.Script(script[2]);
  if (!script[2].startsWith('const bank=')) compiled.runInContext(context);
}

const {GRE_BANK: bank, GRE_ANSWERS: answers} = context.window;
const normalize = value => JSON.parse(JSON.stringify(value));
assert.equal(answers.sections.length, 100);
assert.equal(content.length, 20);
for (const {id, questions, kinds, answers: reference} of content) {
  assert.equal(questions.length, 7);
  assert.deepEqual(normalize(bank['section' + id]), questions);
  assert.deepEqual(normalize(answers.sections[id - 1].answers), keys[id - 1].answers);
  for (const [i, q] of questions.entries()) {
    const label = `Section ${id} question ${i + 1}`;
    assert.equal(q.number, i + 1, label);
    assert.equal((q.t.match(/______/g) || []).length, kinds[i] === 'multi' ? reference[i].length : 1, label);
    assert.doesNotMatch(q.t, /\(1i\)|FUSE GRE|ASHP 100|_{7,}/, label);
    for (const key of ['translation', 'grammar', 'reason']) assert(q[key].length > 15, `${label} ${key}`);
    if (id === 98 && i === 4) {
      assert.equal(q.o.length, 0);
    } else {
      assert.equal(q.o.length, kinds[i] === 'single' ? 5 : kinds[i] === 'equivalent' ? 6 : reference[i].length * 3, label);
      for (const [j, option] of q.o.entries()) {
        assert(option.startsWith('ABCDEFGHI'[j] + '. '), label);
        const word = option.slice(3).normalize('NFKC').toLowerCase().replaceAll('’', "'");
        assert(dictionary[word]?.[1], `${label} ${option}`);
      }
    }
    for (const p of q.sourcePages) assert(fs.existsSync(`dist/pages/p-${String(p).padStart(3, '0')}.jpg`), label);
  }
}
console.log('PASS: Sections 81–100, 140 reviews, supplied answers, option meanings, scan links, and JavaScript syntax.');
