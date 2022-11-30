export function sortPans(valA, valB) {
    if (valA.pointId && valB.pointId) {
        return valA.pointId - valB.pointId;
    }
    return valA.id - valB.id;
}

export default null;
