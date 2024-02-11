/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import './Game.css'

const GobbletGobblersRules = ({ setIsModalOpen }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
        <h1>Rules</h1>
        <p>Get ready for a delicious battle of wits in Gobblet Gobblers, a fast-paced and strategic game for two players!</p>
        <br/>

        <h2>Objective</h2>
        <p>Be the first player to line up 3 of your Gobblers in a row (vertically, horizontally, or diagonally) on the 3x3 playing board.</p>
        <br />

        <h2>Components</h2>
        <ul>
          <li>12 Gobblers: 6 for player 1 and 6 for player 2 </li>
        </ul>
        <br />

        <h2>Gameplay</h2>
        <ol>
          <li>Choose your Peice.</li>
          <li>Take turns playing your Gobblers. On your turn, you can either:</li>
          <ul>
            <li><b>Place a new Gobbler:</b> Put one of your Gobblers on an empty space or stack it on top of a smaller Gobbler (yours or your opponent's).</li>
            <li><b>Gobble a Gobbler:</b> Use a larger Gobbler to capture a smaller Gobbler (yours or your opponent's) on the board. Remember, only larger Gobblers can gobble!</li>
          </ul>
          <li>You can gobble your own Gobblers if it helps your strategy.</li>
          <li>Think ahead and consider your opponent's moves. They might be planning a sneaky gobble!</li>
        </ol>
        <br />

        <h2>Winning</h2>
        <p>The first player to get 3 of their Gobblers in a row wins! Gobble up your opponent's pieces and build your own lines to claim victory.</p>
        <br />

        <h2>Tips</h2>
        <ul>
          <li>Start with smaller Gobblers to block your opponent's potential lines.</li>
          <li>Use your large Gobblers wisely to gobble key pieces and create winning opportunities.</li>
          <li>Pay attention to stacked Gobblers. You might be able to uncover a smaller one for gobbling!</li>
          <li>Have fun and gobble your way to victory!</li>
        </ul>
        <br />

        <h2>NOTE : </h2>
        <p>you can not change your gobbler after grabbing it.</p>
        <br />
        
        <p>Ready to play? Gather your Gobblers and prepare for a delicious battle of wits!</p>
      </div>
    </div>
  );
};

export default GobbletGobblersRules;
