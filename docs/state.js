const defaultBool = (val, defaultValue = true) => {
    if (val == 't' || val == 'f')
        return val;
    return defaultValue ? 't' : 'f';
};
const getState = () => {
    const state = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    state.g = defaultBool(state.g, true);
    state.ug = defaultBool(state.ug, true);
    state.q || (state.q = '');
    return state;
};
const applyStateToURL = (state) => {
    const newParams = new URLSearchParams(Object.entries(state));
    const url = new URL(window.location.href);
    url.search = newParams.toString();
    window.history.pushState('', '', url);
};
const queryBox = document.getElementById('query_box');
const undergraduate = document.getElementById('undergraduate');
const graduate = document.getElementById('graduate');
export function applyState(state = getState()) {
    queryBox.value = state.q;
    undergraduate.checked = state.ug == 't';
    graduate.checked = state.g == 't';
    applyStateToURL(state);
}
export function updateState(state = getState()) {
    state.q = queryBox.value;
    state.ug = undergraduate.checked ? 't' : 'f';
    state.g = graduate.checked ? 't' : 'f';
    applyStateToURL(state);
}
