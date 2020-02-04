const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require("../compile");

let accounts;
let inbox;
const INITIAL_VALUE = "hi there";
const LATER_VALUE = "bye there";

beforeEach(async () => {
  //get a list of all accounts
  accounts = await web3.eth.getAccounts();
  //use one of these accounts to deploy contract

  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITIAL_VALUE]
    })
    .send({ from: accounts[0], gas: "1000000" });

  inbox.setProvider(provider);
});

describe("Inbox", () => {
  it("deploys a contract and gives it an address", () => {
    assert.ok(inbox.options.address);
  });
  it("initial message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_VALUE);
  });
  it("modification", async () => {
    await inbox.methods
      .setMessage(LATER_VALUE)
      .send({ from: accounts[0], gas: "1000000" });
    const message = await inbox.methods.message().call();
    assert.equal(LATER_VALUE, message);
  });
});

/*

Sample tests
class Car {
  park() {
    return "stopped";
  }

  drive() {
    return "vroom";
  }
}

let x;

beforeEach(() => {
  x = new Car();
});

describe("Car Class Test", () => {
  it("park function", () => {
    assert.equal(x.park(), "stopped");
  });

  it("can drive", () => {
    assert.equal(x.drive(), "vroom");
  });
});
*/
