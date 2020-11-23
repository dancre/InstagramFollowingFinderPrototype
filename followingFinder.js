const api = require('instagram-private-api');
const mockResponse = require('./mockResponse.json');

const getFollowing = async userName => {
    const ig = new api.IgApiClient();
    const credentials = {
        "username": "bobbycraycraycray",
        "password": "nov 06 2020"
    }
    ig.state.generateDevice(credentials.username);

    // Not required but recommended
    await ig.simulate.preLoginFlow();

    await ig.account.login(credentials.username, credentials.password);
    
    // The same as preLoginFlow()
    // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
    process.nextTick(async () => await ig.simulate.postLoginFlow());

    let followings = []

    const user = await ig.user.searchExact(userName)
    const userInfo = await ig.user.info(user.pk)

    try {
        const followingFeed = ig.feed.accountFollowing(user.pk)
        do {
            let items = await followingFeed.items()
            followings.push(...items)
        } while (followingFeed.moreAvailable);
    } catch (error) {
        console.log(error)
    }

    return followings;
  };

  module.exports.getFollowing = getFollowing;

  const getFollowingMock = async userName => {
      return mockResponse;
  };

  module.exports.getFollowingMock = getFollowingMock;