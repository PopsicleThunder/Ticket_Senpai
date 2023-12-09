// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface IERC721Ticket {
    function mintUniqueTicket(address to, uint256 tokenId) external;
    function burnUniqueTicket(uint256 tokenId) external;
}

interface IERC1155Ticket {
    function mintNonUniqueTicket(address to, uint256 tokenId, uint256 amount, bytes memory data) external;
    function burnNonUniqueTicket(address to, uint256 tokenId, uint256 amount) external;
}

contract TicketingPlatform {
    enum TicketType { Unique, NonUnique }

    struct Occasion {
        string name;
        string date;
        string venue;
        string description;
        TicketType ticketType;
    }

    struct Ticket721 {
        uint256 eventId;
        uint256 tokenId;
        address owner;
        uint256 price;
    }

    struct Ticket1155 {
        uint256 eventId;
        uint256 tokenId;
        address owner;
        uint256 value;
        uint256 price;
    }

    mapping(uint256 => Occasion) public occasions; //list all events
    mapping(uint256 => Ticket721) public tickets721; //ticket details for specific tokenid721
    mapping(uint256 => Ticket1155) public tickets1155; //ticket details for specific tokenid1155
    mapping(uint256 => uint256) public eventTicketSupply; //supply for particular event
    mapping(uint256 => uint256) public eventTicketPrice;
    mapping(uint256 => mapping(uint256 => uint256)) public nonUniqueBatchs;  
    mapping(uint256 => mapping(uint256 => uint256)) public nonUniqueBatchsPrice;  

    event OccasionCreated(uint256 indexed eventId, string name, string date, string venue, TicketType ticketType);
    event TicketMinted(uint256 indexed eventId, uint256 indexed tokenId, address indexed owner);
    event batchTicketMinted(uint256 indexed eventId, uint256 indexed tokenId, uint256 value, address indexed owner);
    event TicketBurned(uint256 indexed eventId, uint256 indexed tokenId, address indexed owner);
    event batchTicketBurned(uint256 indexed eventId, uint256 indexed tokenId, uint256 value, address indexed owner);
    event Paused(bool paused);
    
    address private owner;
    address private erc721Address;
    address private erc1155Address;
    uint256 private nextTokenId;
     bool private paused;


    constructor(address _erc721Address, address _erc1155Address) {
        owner = msg.sender;
        erc721Address = _erc721Address;
        erc1155Address = _erc1155Address;
        nextTokenId = 1;
         paused = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    function createOccasion(uint256 eventId, string memory name, string memory date, string memory description, string memory venue, TicketType ticketType) external onlyOwner {
        Occasion memory newOccasion = Occasion(name, date, venue, description, ticketType);
        occasions[eventId] = newOccasion;
        emit OccasionCreated(eventId, name, date, venue, ticketType);
    }

    function setEventTicketSupply(uint256 eventId, uint256 supply, uint256 price) external {
        eventTicketSupply[eventId] = supply;
        eventTicketPrice[eventId] = price;

    }

    function setEventBatchTicketSupply(uint256 eventId,uint256 batch, uint256 supply,uint256 price) external {
        nonUniqueBatchs[eventId][batch]= supply;
        nonUniqueBatchsPrice[eventId][batch]= price;
    }

    function mintTicket(uint256 eventId, address to) external payable {
        require(eventTicketSupply[eventId] > 0, "No tickets available for this event");
        require(msg.value >= eventTicketPrice[eventId], "Insufficient funds");


        Occasion memory occasion = occasions[eventId];
        uint256 tokenId = nextTokenId++;

        if (occasion.ticketType == TicketType.Unique) {
            IERC721Ticket(erc721Address).mintUniqueTicket(to, tokenId);
        }

        tickets721[tokenId] = Ticket721(eventId, tokenId, to, eventTicketPrice[eventId]);
        eventTicketSupply[eventId]--;

        emit TicketMinted(eventId, tokenId, to);
    }

    function mintTicket(uint256 eventId, address to, uint256 _batch, uint256 _value) external payable {
        require(nonUniqueBatchs[eventId][_batch] > 0, "No tickets available for this event");
        require(msg.value >= nonUniqueBatchsPrice[eventId][_batch] * _value, "Insufficient funds");


        Occasion memory occasion = occasions[eventId];
        // uint256 tokenId = nextTokenId++;

        if (occasion.ticketType == TicketType.NonUnique) {
            IERC1155Ticket(erc1155Address).mintNonUniqueTicket(to, _batch, _value, "");
        } 
        tickets1155[_batch] = Ticket1155(eventId, _batch, to, _value, nonUniqueBatchsPrice[eventId][_batch] );
        nonUniqueBatchs[eventId][_batch] -= _value;

         emit batchTicketMinted(eventId, _batch, _value, to);
    }
    function burnTicket(uint256 eventId, uint256 tokenId) external whenNotPaused {
        require(tickets721[tokenId].owner == msg.sender, "Not the ticket owner");
        Occasion memory occasion = occasions[eventId];

        if (occasion.ticketType == TicketType.Unique) {
            IERC721Ticket(erc721Address).burnUniqueTicket(tokenId);
        }

        delete tickets721[tokenId];
        payable(msg.sender).transfer(eventTicketPrice[eventId]);
        eventTicketSupply[eventId]++;
        


        emit TicketBurned(eventId, tokenId, msg.sender);
    }

    function burnTicket(uint256 eventId, uint256 _batch, uint256 _value) external whenNotPaused {
        require(tickets1155[_batch].owner == msg.sender, "Not the ticket owner");
        Occasion memory occasion = occasions[eventId];

        if (occasion.ticketType == TicketType.NonUnique) {
            IERC1155Ticket(erc1155Address).burnNonUniqueTicket(msg.sender, _batch, _value);
        } 

        delete tickets1155[_batch];
        payable(msg.sender).transfer(nonUniqueBatchsPrice[eventId][_batch]);
        nonUniqueBatchs[eventId][_batch] += _value;

        emit batchTicketBurned(eventId, _batch, _value, msg.sender);
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(true);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Paused(false);
    }

    function isPaused() external view returns (bool) {
        return paused;
    }
}