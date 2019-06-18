let jobSubmit = document.getElementById("checkout-button-sku_FAq0aurWH7krHS");
jobSubmit.onclick = () => purchaseClicked();
var stripeHandler = StripeCheckout.configure({
	key: stripePublicKey,
	locale: 'auto',
	// once everything has been confirmed, stripe was send back + call
	// the below method for us
	token: function (token) {
		console.log("confirmed, now add job to database.", token);
	}
});

function purchaseClicked() {
    // open stripe pop up box
    console.log('clicked');
	const price = 8900;
	stripeHandler.open({
		amount: price
	});
}


