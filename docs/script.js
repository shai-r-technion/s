import { applyState, updateState } from './state.js';
import { courseList } from './list.js';
import { createFuse } from './fuse.js';
applyState();
const queryBox = document.getElementById('query_box');
const resultsDiv = document.getElementById('results');
const fuse = createFuse();
const highlight = (text, indices, width = null) => {
    let out = '';
    let i = 0;
    for (const [from, to] of indices) {
        out += text.slice(i, from);
        out += `<strong>${text.slice(from, to + 1)}</strong>`;
        i = to + 1;
    }
    const extra = width ? ' '.repeat(width - i) : '';
    return extra + out + text.slice(i);
};
function escapeHTML(str) {
    return new Option(str).innerHTML;
}
const DESC_LEN = 200;
const showResults = (results) => {
    const shorten = (s, len = DESC_LEN) => s.length <= len ? s : s.slice(0, len - 3) + '...';
    resultsDiv.innerHTML = '';
    for (const result of results) {
        let { syllabus, name, number } = result.item;
        syllabus = escapeHTML(shorten(syllabus));
        for (const match of result.matches) {
            switch (match.key) {
                case 'syllabus':
                    syllabus = highlight(syllabus, match.indices);
                    break;
                case 'course_name':
                    name = highlight(name, match.indices);
                    break;
                case 'course_num':
                    number = highlight(number, match.indices, 6);
                    break;
            }
        }
        const article = document.createElement('article');
        article.classList.add('result');
        const hgroup = document.createElement('hgroup');
        hgroup.innerHTML = `<h3><a target="_blank" href="https://students.technion.ac.il/local/technionsearch/course/${number}">${number}</a> ${name}</h3>`;
        const p = document.createElement('p');
        p.style.fontSize = '12px';
        p.innerHTML = syllabus;
        hgroup.appendChild(p);
        article.appendChild(hgroup);
        resultsDiv.appendChild(article);
        continue;
    }
};
const containsAll = (a, b) => {
    const sa = new Set(a);
    for (const x of b)
        if (!sa.has(x))
            return false;
    return true;
};
const hasPres = (has, needed) => {
    if (!needed.length)
        return true;
    for (const group of needed) {
        if (containsAll(has, group))
            return true;
    }
    return false;
};
const search = () => {
    const query = queryBox.value;
    let results = fuse.search(query);
    const checkKdams = document.getElementById('toggle_kdams').checked;
    if (checkKdams) {
        const kdams = Array.from(document.querySelectorAll('.kdam'))
            .filter((x) => x.checked)
            .map((x) => x.value);
        results = results.filter((r) => hasPres(kdams, r.item.pres));
    }
    const graduate = document.getElementById('graduate').checked;
    const undergraduate = document.getElementById('undergraduate').checked;
    results = results.filter((r) => {
        const frame = courseList[r.refIndex].general.misgeret;
        if (!frame)
            return true;
        return ((undergraduate && frame.includes('תואר ראשון')) ||
            (graduate && frame.includes('תארים מתקדמים')));
    });
    results = results.slice(0, 10);
    showResults(results);
};
document
    .querySelectorAll('input')
    .forEach((input) => input.addEventListener('input', () => (updateState(), search())));
document.getElementById('toggle_kdams').addEventListener('input', (e) => {
    const checked = e.target.checked;
    document
        .querySelectorAll('.kdam')
        .forEach((el) => (el.disabled = !checked));
});
document.addEventListener('DOMContentLoaded', () => {
    queryBox.value || (queryBox.value = '234124');
    queryBox.dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true,
    }));
});
