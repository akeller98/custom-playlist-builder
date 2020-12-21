import json

def main():
    init_dict = {}
    init_dict["popular_genres"] = {}
    init_dict["genres"] = {}
    with open('./genres.json', 'r') as f:
        data = f.read()
    data = json.loads(data)
    for genre in data["popular_genres"]:
        init_dict["popular_genres"][genre] = False
    for genre in data["genres"]:
        init_dict["genres"][genre] = False
    with open('./genreSelectInitialState.json', 'w', encoding='utf-8') as outfile:
        json.dump(init_dict, outfile)

if __name__ == "__main__":
    main()