import { FaCoins, FaCreditCard } from 'react-icons/fa';

export default function CreditsModal({ id }) {

    const frequentOffer = [
        {
            reward: 100,
            price: 150,
            comment: "Get 10% live chat credits and chat with your Fave. mentor NOW!"
        }
    ]

    const allOtherOffers = [
        {
            reward: 200,
            price: 250,
            comment: "Best Deal, 15% discount. Get ALL the answers you need!!"
        }, {
            reward: 300,
            price: 450,
            comment: "True love in-depth package: Ask 12 Questions"
        }, {
            reward: 500,
            price: 750,
            comment: "Get bonus live credits to help you get started on journey!"
        }, {
            reward: 1000,
            price: 1500,
            comment: "Life insight Package : ask 8 Questions"
        }
    ]

    return <div class="modal fade" id={id} tabindex="-1" aria-labelledby="credit-modal-label" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Credits</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {/* current balance */}
                    <div className="d-flex justify-content-center gap-2 bg-success rounded p-3 text-white fw-bold mb-3 fs-3">
                        <span>Current Balance:</span>
                        {/* extract this from api/server */}
                        <span>100 Points</span>
                    </div>
                    {/* purchase credits */}
                    <div>
                        <span className="fw-light fs-6">Select the number of credits you want to purchase</span>
                        <hr />
                        {/* offer */}
                        <div className="container">
                            {/* frequent offers */}
                            {/* <div className="row">
                                {frequentOffer.map((offer)=>{
                                    return <div className="col-12 col-md-6 ">
                                    <div className="bg-secondary bg-opacity-10 border rounded p-3 text-secondary d-flex justify-content-between h-100"> */}
                                        {/* info */}
                                        {/* <div className='d-flex flex-column justify-content-between' style={{ width: "15rem" }}>
                                            <div className="d-flex fw-bold gap-3 align-items-center fs-4">
                                                <FaCoins style={{ fontSize: '30px', color: 'gold' }} />
                                                <span>{offer.reward} Credits</span>
                                            </div>
                                            <div className="fs-7 fw-light">
                                                <span style={{ fontSize: "15px" }}>{offer.comment}</span>
                                            </div>
                                        </div> */}
                                        {/* vertical line */}
                                        {/* <span className="text-black border border-1"></span> */}
                                        {/* price */}
                                        {/* <div className='d-flex flex-column justify-content-center align-items-center'>
                                            <p style={{ fontSize: "15px" }}>Buy now at</p>
                                            <p className='fw-bold fs-4'>₹ {offer.price}</p>
                                        </div>
                                    </div>
                                </div>
                                })}
                            </div> */}

                            {/* other offers */}
                            <div className="row g-3">
                                {allOtherOffers.map((offer) => {
                                    return <div className="col-12 col-md-6 ">
                                        <div className="bg-secondary bg-opacity-10 border rounded p-3 text-secondary d-flex justify-content-between h-100">
                                            {/* info */}
                                            <div className='d-flex flex-column justify-content-between' style={{ width: "15rem" }}>
                                                <div className="d-flex fw-bold gap-3 align-items-center fs-4">
                                                    <FaCoins style={{ fontSize: '30px', color: 'gold' }} />
                                                    <span>{offer.reward} Points</span>
                                                </div>
                                                <div className="fs-7 fw-light">
                                                    <span style={{ fontSize: "15px" }}>{offer.comment}</span>
                                                </div>
                                            </div>
                                            {/* vertical line */}
                                            <span className="text-black border border-1"></span>
                                            {/* price */}
                                            <div className='d-flex flex-column justify-content-center align-items-center'>
                                                <p style={{ fontSize: "15px" }}>Buy now at</p>
                                                <p className='fw-bold fs-4'>₹ {offer.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div> */}
            </div>
        </div>
    </div>
}