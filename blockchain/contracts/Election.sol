// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CollegeElection {
    address public admin;
    bool public electionStarted = false;
    bool public electionEnded = false;

    struct Candidate {
        string id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool hasVoted;
        string votedCandidateId;
        string name;
        uint age;
        string gender;
        string voterId;
        bool isRegistered;
    }

    mapping(string => Candidate) public candidates; // Candidate ID to Candidate
    mapping(address => Voter) public voters; // Ethereum address to Voter
    mapping(string => bool) public voterIds; // Ensures voter ID uniqueness
    string[] public candidateList; // List of candidate IDs for enumeration

    event ElectionStarted();
    event ElectionEnded();
    event Voted(address indexed voter, string candidateId);
    event VoterRegistered(address indexed voter, string name, string voterId);
    event VoterLogin(address indexed voter, string name);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Register Candidate (Admin Only)
    function addCandidate(string memory _id, string memory _name) public onlyAdmin {
        require(bytes(candidates[_id].id).length == 0, "Candidate already exists");
        candidates[_id] = Candidate(_id, _name, 0);
        candidateList.push(_id);
    }

    // Start Election (Admin Only)
    function startElection() public onlyAdmin {
        require(!electionStarted, "Election is already started");
        require(!electionEnded, "Election has ended");
        electionStarted = true;
        emit ElectionStarted();
    }

    // End Election (Admin Only)
    function endElection() public onlyAdmin {
        require(electionStarted, "Election is not started yet");
        require(!electionEnded, "Election is already ended");
        electionEnded = true;
        emit ElectionEnded();
    }

    // Register Voter
    function registerVoter(string memory _name, uint _age, string memory _gender, string memory _voterId) public {
        require(!voters[msg.sender].isRegistered, "Voter is already registered");
        require(!voterIds[_voterId], "Voter ID is already taken");

        voters[msg.sender] = Voter({
            hasVoted: false,
            votedCandidateId: "",
            name: _name,
            age: _age,
            gender: _gender,
            voterId: _voterId,
            isRegistered: true
        });

        voterIds[_voterId] = true; // Mark voter ID as used

        emit VoterRegistered(msg.sender, _name, _voterId);
    }

    // Login Voter
    function loginVoter(string memory _voterId) public view returns (string memory) {
        require(voters[msg.sender].isRegistered, "Voter not registered");
        require(keccak256(abi.encodePacked(voters[msg.sender].voterId)) == keccak256(abi.encodePacked(_voterId)), "Voter ID does not match");
        return voters[msg.sender].name;
    }

    // Vote for a Candidate
    function vote(string memory _candidateId) public {
        require(voters[msg.sender].isRegistered, "Voter not registered");
        require(electionStarted, "Election is not started yet");
        require(!electionEnded, "Election has ended");
        require(!voters[msg.sender].hasVoted, "Already voted");

        require(bytes(candidates[_candidateId].id).length != 0, "Candidate does not exist");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    // Get Election Results for a Candidate
    function getResults(string memory _candidateId) public view returns (uint) {
        require(electionEnded, "Election is not ended yet");
        require(bytes(candidates[_candidateId].id).length != 0, "Candidate does not exist");

        return candidates[_candidateId].voteCount;
    }

    // Get List of Candidates
    function getCandidateList() public view returns (Candidate[] memory) {
        Candidate[] memory result = new Candidate[](candidateList.length);
        for (uint i = 0; i < candidateList.length; i++) {
            string memory id = candidateList[i];
            result[i] = candidates[id];
        }
        return result;
    }

    // Get Voter Details
    function getVoterDetails(address _voter) public view returns (Voter memory) {
        require(voters[_voter].isRegistered, "Voter not registered");
        return voters[_voter];
    }
}
