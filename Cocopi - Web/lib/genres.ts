export class Genre {
    id: string;
    genre: string;
    isClicked: boolean;

    constructor(id: string, genre: string, isClicked: boolean = false) {
        this.id = id
        this.genre = genre
        this.isClicked = isClicked
    }
    public updateState(isClicked: boolean) {
        this.isClicked = isClicked
        return this
    }
}


export class GenreList {
    list: Genre[];

    constructor(genreList: Genre[] = []) {
        this.list = genreList;
    }
    public push(g: Genre) {
        this.list.push(g);
    }
    public index(g: Genre) {
        for (let exGenre of this?.list) {
            if (exGenre?.id == g.id) {
                return this?.list.indexOf(exGenre)
            }
        }
        return 0
    }
    public updateState(g: Genre) {
        this.list[this.index(g)] = g.updateState(!g.isClicked)
    }
    public getSelected() {
        const selectedList = new GenreList();
        for (let g in this.list) {
            if (this.list[g]?.isClicked) {
                selectedList.push(this.list[g])
            }
        }
        return selectedList
    }
    public displayList() {
        const selectedGenres = this.getSelected()
        const displayArray: string[] = []
        selectedGenres.list.forEach(genre => {
            displayArray.push(genre?.genre)
        });
        if (displayArray.length == 1) return displayArray[0]
        return displayArray.join(", ") || undefined
    }

}