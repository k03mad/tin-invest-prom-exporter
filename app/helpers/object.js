/**
 * @param {object} replacementsObj
 * @param {string} name
 * @returns {string}
 */
export const replaceByKeyValue = (replacementsObj, name) => {
    let nameNew = name;

    Object.entries(replacementsObj).forEach(([from, to]) => {
        nameNew = name.replace(from, to);
    });

    return nameNew;
};
