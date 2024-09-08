import asyncio
from diplomacy import connect

async def play() -> None:
    connection = await connect("localhost", 8432)
    channel = await connection.authenticate(
        "admin", "password"
    )

    game = await channel.join_game(
        game_id='test'
    )

    await game.process()

    return


def main() -> None:
    asyncio.run(play())

if __name__ == "__main__":
    main()
