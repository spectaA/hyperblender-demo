module.exports = function collisionDetection(cl_cals) {
    let collisions = [];
    //Je ne garde que les cl_cals visibles et je trie ceux qui restent par date de début
    let sorted_cl_cals = cl_cals.filter(cl_cal => cl_cal.visible).sort(function (a, b) {
        return a.start - b.start;
    });
    //Je compare chaque cl_cal de la liste triée à son successeur, et s'il y a collision, je l'ajoute à la liste des collisions
    console.log(sorted_cl_cals);
    sorted_cl_cals.reduce((a, b) => {
        if (a.end > b.start)
            collisions.push({
                cals: {
                    ids: [a.id, b.calId],
                    names: [a.alias, b.calAlias],
                    colors: [a.color, b.calColor]
                },
                start: b.start,
                //J'avais mal compris le fonctionnement de apply, la ligne ci-dessous devrait fonctionner
                end: new Date(Math.min(a.end, b.end))
            });
        return b;
    })
    //TODO : fusionner les collisions entre lesquelles il y a des collisions ? Si oui, que faire de la propriété cals ?
    return collisions;
}