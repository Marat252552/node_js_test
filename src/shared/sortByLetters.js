const sortByLetters = (entry1, entry2) => {
    const name1 = entry1.API.toUpperCase()
    const name2 = entry2.API.toUpperCase()
    if (name1 < name2) return -1
    if (name1 > name2) return 1
    return 0
}

module.exports = sortByLetters