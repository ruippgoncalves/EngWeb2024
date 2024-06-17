import "@ruffle-rs/ruffle";

const RufflePlayer = window.RufflePlayer;
delete window.RufflePlayer;

export function createRuffleEmbed(id, url) {
    const d = document.getElementById(id);
    const ruffle = RufflePlayer.newest();
    const player = ruffle.createPlayer();
    d.appendChild(player);
    player.load(url);
}
