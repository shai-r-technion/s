import { courseList } from './list.js';
const extractPreGroups = (str) => {
    if (!str)
        return [];
    return str.split(' או ').map((g) => {
        if (g[0] !== '(')
            return [g];
        return g.slice(1, -1).split(' ו- ');
    });
};
export const searchList = courseList.map((courseData) => {
    const { number, name, syllabus, pres } = courseData.general;
    return {
        number,
        name,
        syllabus,
        pres: extractPreGroups(pres),
    };
});
