<Card
  style={{
    backgroundColor: "#F1F1F1",
    borderRadius: "10px",
    height: "70px",
  }}
  className="d-flex align-items-center px-3"
>
  <Card.Body className="d-flex w-100 justify-content-between align-items-center">
    <div className="d-flex flex-column gap-1">
      {session.cost > 0 ? (
        <div
          className="d-flex gap-0 align-items-center py-0 px-0 rounded-pill"
          style={{
            backgroundColor: "#F4D35E",
            fontSize: "0.8rem",
            height: "0.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <GiTwoCoins  />
          {session.cost}
        </div>
      ) : null}
      <h4 style={{ fontSize: "1rem" }} className="m-0">
        {session.name}
      </h4>
      <h5 style={{ fontSize: "0.8rem" }} className="m-0">
        {session.duration}
      </h5>
    </div>
    <Button
      className="ms-auto my-auto py-1 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#037F7D",
        borderRadius: "10px",
        height: "1.7rem",
        textAlign: "center",
      }}
    >
      Book
    </Button>
  </Card.Body>
</Card>
