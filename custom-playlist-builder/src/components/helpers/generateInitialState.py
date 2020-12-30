import json

def main():
    init_dict = {}
    init_dict["popular_genres"] = {}
    init_dict["genres"] = {}
    pop_genres_arr = []
    genres_arr = []
    with open('./genres.json', 'r') as f:
        data = f.read()
    data = json.loads(data)
    for genre in data["popular_genres"]:
        pop_genres_arr.append({'id': genre, 'checked': False})
    for genre in data["genres"]:
        genres_arr.append({'id': genre, 'checked': False})
    init_dict["popular_genres"] = pop_genres_arr
    init_dict["genres"] = genres_arr
    with open('./genreSelectInitialState.json', 'w', encoding='utf-8') as outfile:
        json.dump(init_dict, outfile, indent=4)

if __name__ == "__main__":
    main()