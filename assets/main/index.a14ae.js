window.__require=function t(e,n,i){function o(a,r){if(!n[a]){if(!e[a]){var c=a.split("/");if(c=c[c.length-1],!e[c]){var u="function"==typeof __require&&__require;if(!r&&u)return u(c,!0);if(s)return s(c,!0);throw new Error("Cannot find module '"+a+"'")}a=c}var h=n[a]={exports:{}};e[a][0].call(h.exports,function(t){return o(e[a][1][t]||t)},h,h.exports,t,e,n,i)}return n[a].exports}for(var s="function"==typeof __require&&__require,a=0;a<i.length;a++)o(i[a]);return o}({ActorRenderer:[function(t,e){"use strict";cc._RF.push(e,"1a792KO87NBg7vCCIp1jq+j","ActorRenderer");var n=t("Game"),i=t("Types"),o=t("Utils"),s=i.ActorPlayingState;cc.Class({extends:cc.Component,properties:{playerInfo:cc.Node,stakeOnTable:cc.Node,cardInfo:cc.Node,cardPrefab:cc.Prefab,anchorCards:cc.Node,spPlayerName:cc.Sprite,labelPlayerName:cc.Label,labelTotalStake:cc.Label,spPlayerPhoto:cc.Sprite,callCounter:cc.ProgressBar,labelStakeOnTable:cc.Label,spChips:{default:[],type:cc.Sprite},labelCardInfo:cc.Label,spCardInfo:cc.Sprite,animFX:cc.Node,cardSpace:0},onLoad:function(){},init:function(t,e,i,o,s){this.actor=this.getComponent("Actor"),this.isCounting=!1,this.counterTimer=0,this.turnDuration=o,this.playerInfo.position=e,this.stakeOnTable.position=i,this.labelPlayerName.string=t.name,this.updateTotalStake(t.gold);var a=t.photoIdx%5;this.spPlayerPhoto.spriteFrame=n.instance.assetMng.playerPhotos[a],this.animFX=this.animFX.getComponent("FXPlayer"),this.animFX.init(),this.animFX.show(!1),this.cardInfo.active=!1,s&&(this.spCardInfo.getComponent("SideSwitcher").switchSide(),this.spPlayerName.getComponent("SideSwitcher").switchSide())},update:function(t){this.isCounting&&(this.callCounter.progress=this.counterTimer/this.turnDuration,this.counterTimer+=t,this.counterTimer>=this.turnDuration&&(this.isCounting=!1,this.callCounter.progress=1))},initDealer:function(){this.actor=this.getComponent("Actor"),this.animFX=this.animFX.getComponent("FXPlayer"),this.animFX.init(),this.animFX.show(!1)},updateTotalStake:function(t){this.labelTotalStake.string="$"+t},startCountdown:function(){this.callCounter&&(this.isCounting=!0,this.counterTimer=0)},resetCountdown:function(){this.callCounter&&(this.isCounting=!1,this.counterTimer=0,this.callCounter.progress=0)},playBlackJackFX:function(){this.animFX.playFX("blackjack")},playBustFX:function(){this.animFX.playFX("bust")},onDeal:function(t,e){var n=cc.instantiate(this.cardPrefab).getComponent("Card");this.anchorCards.addChild(n.node),n.init(t),n.reveal(e);var i=cc.v2(0,0),o=this.actor.cards.length-1,s=cc.v2(this.cardSpace*o,0);n.node.setPosition(i),this._updatePointPos(s.x);var a=cc.moveTo(.5,s),r=cc.callFunc(this._onDealEnd,this);n.node.runAction(cc.sequence(a,r))},_onDealEnd:function(){this.resetCountdown(),this.actor.state===s.Normal&&this.startCountdown(),this.updatePoint()},onReset:function(){this.cardInfo.active=!1,this.anchorCards.removeAllChildren(),this._resetChips()},onRevealHoldCard:function(){cc.find("cardPrefab",this.anchorCards).getComponent("Card").reveal(!0),this.updateState()},updatePoint:function(){switch(this.cardInfo.active=!0,this.labelCardInfo.string=this.actor.bestPoint,this.actor.hand){case i.Hand.BlackJack:this.animFX.show(!0),this.animFX.playFX("blackjack");break;case i.Hand.FiveCard:}},_updatePointPos:function(t){this.cardInfo.setPosition(t+50,0)},_resetChips:function(){for(var t=0;t<this.spChips.length;++t)this.spChips.enabled=!1},updateState:function(){switch(this.actor.state){case s.Normal:this.cardInfo.active=!0,this.spCardInfo.spriteFrame=n.instance.assetMng.texCardInfo,this.updatePoint();break;case s.Bust:var t=o.getMinMaxPoint(this.actor.cards).min;this.labelCardInfo.string="bust("+t+")",this.spCardInfo.spriteFrame=n.instance.assetMng.texBust,this.cardInfo.active=!0,this.animFX.show(!0),this.animFX.playFX("bust"),this.resetCountdown();break;case s.Chorrr:var e=o.getMinMaxPoint(this.actor.cards).max;this.labelCardInfo.string="suspension("+e+")",this.spCardInfo.spriteFrame=n.instance.assetMng.texCardInfo,this.resetCountdown()}}}),cc._RF.pop()},{Game:"Game",Types:"Types",Utils:"Utils"}],Actor:[function(t,e){"use strict";cc._RF.push(e,"7d008dTf6xB2Z0wCAdzh1Rx","Actor");var n=t("Types"),i=t("Utils"),o=n.ActorPlayingState;cc.Class({extends:cc.Component,properties:{cards:{default:[],serializable:!1,visible:!1},holeCard:{default:null,serializable:!1,visible:!1},bestPoint:{get:function(){return i.getMinMaxPoint(this.cards).max}},hand:{get:function(){var t=this.cards.length;return this.holeCard&&++t,t>=5?n.Hand.FiveCard:2===t&&21===this.bestPoint?n.Hand.BlackJack:n.Hand.Normal}},canReport:{get:function(){return this.hand!==n.Hand.Normal},visible:!1},renderer:{default:null,type:cc.Node},state:{default:o.Normal,notify:function(t){this.state!==t&&this.renderer.updateState()},type:o,serializable:!1}},init:function(){this.ready=!0,this.renderer=this.getComponent("ActorRenderer")},addCard:function(t){this.cards.push(t),this.renderer.onDeal(t,!0);var e=this.holeCard?[this.holeCard].concat(this.cards):this.cards;i.isBust(e)&&(this.state=o.Bust)},addHoleCard:function(t){this.holeCard=t,this.renderer.onDeal(t,!1)},chorr:function(){this.state=o.Chorrr},revealHoldCard:function(){this.holeCard&&(this.cards.unshift(this.holeCard),this.holeCard=null,this.renderer.onRevealHoldCard())},report:function(){this.state=o.Report},reset:function(){this.cards=[],this.holeCard=null,this.reported=!1,this.state=o.Normal,this.renderer.onReset()}}),cc._RF.pop()},{Types:"Types",Utils:"Utils"}],AssetMng:[function(t,e){"use strict";cc._RF.push(e,"54522LcoVpPHbrqYgwp/1Qm","AssetMng"),cc.Class({extends:cc.Component,properties:{texBust:cc.SpriteFrame,texCardInfo:cc.SpriteFrame,texCountdown:cc.SpriteFrame,texBetCountdown:cc.SpriteFrame,playerPhotos:[cc.SpriteFrame]}}),cc._RF.pop()},{}],AudioMng:[function(t,e){"use strict";cc._RF.push(e,"01ca4tStvVH+JmZ5TNcmuAu","AudioMng"),cc.Class({extends:cc.Component,properties:{winAudio:{default:null,type:cc.AudioClip},loseAudio:{default:null,type:cc.AudioClip},cardAudio:{default:null,type:cc.AudioClip},buttonAudio:{default:null,type:cc.AudioClip},chipsAudio:{default:null,type:cc.AudioClip},bgm:{default:null,type:cc.AudioClip}},playMusic:function(){cc.audioEngine.playMusic(this.bgm,!0)},pauseMusic:function(){cc.audioEngine.pauseMusic()},resumeMusic:function(){cc.audioEngine.resumeMusic()},_playSFX:function(t){cc.audioEngine.playEffect(t,!1)},playWin:function(){this._playSFX(this.winAudio)},playLose:function(){this._playSFX(this.loseAudio)},playCard:function(){this._playSFX(this.cardAudio)},playChips:function(){this._playSFX(this.chipsAudio)},playButton:function(){this._playSFX(this.buttonAudio)}}),cc._RF.pop()},{}],Bet:[function(t,e){"use strict";cc._RF.push(e,"28f38yToT1Pw7NgyeCvRxDC","Bet");var n=t("Game"),i=t("audioManager");cc.Class({extends:cc.Component,properties:{chipPrefab:cc.Prefab,btnChips:{default:[],type:cc.Node},chipValues:{default:[],type:cc.Integer},anchorChipToss:cc.Node},init:function(){this._registerBtns()},_registerBtns:function(){for(var t=this,e=function(e){t.btnChips[i].on("touchstart",function(){n.instance.temsteke(t.chipValues[e])&&t.playAddChip()},this)},i=0;i<t.btnChips.length;++i)e(i)},playAddChip:function(){var t=cc.v2(100*(Math.random()-.5),100*(Math.random()-.5)),e=cc.instantiate(this.chipPrefab);this.anchorChipToss.addChild(e),e.setPosition(t),e.getComponent("TossChip").play()},resetChips:function(){i.instance.PlaySFX("buttonsound"),n.instance.resetStake(),n.instance.info.enabled=!1,this.resetTossedChips()},resetTossedChips:function(){this.anchorChipToss.removeAllChildren()}}),cc._RF.pop()},{Game:"Game",audioManager:"audioManager"}],ButtonScaler:[function(t,e){"use strict";cc._RF.push(e,"a171dSnCXFMRIqs1IWdvgWM","ButtonScaler"),cc.Class({extends:cc.Component,properties:{pressedScale:1,transDuration:.5},onLoad:function(){var t=this,e=cc.find("Menu/AudioMng")||cc.find("Game/AudioMng");function n(){this.stopAllActions(),this.runAction(t.scaleUpAction)}e&&(e=e.getComponent("AudioMng")),t.initScale=this.node.scale,t.button=t.getComponent(cc.Button),t.scaleDownAction=cc.scaleTo(t.transDuration,t.pressedScale),t.scaleUpAction=cc.scaleTo(t.transDuration,t.initScale),this.node.on("touchstart",function(){this.stopAllActions(),this.runAction(t.scaleDownAction)},this.node),this.node.on("touchend",n,this.node),this.node.on("touchcancel",n,this.node)}}),cc._RF.pop()},{}],Card:[function(t,e){"use strict";cc._RF.push(e,"ab67e5QkiVCBZ3DIMlWhiAt","Card"),cc.Class({extends:cc.Component,properties:{point:cc.Label,suit:cc.Sprite,mainPic:cc.Sprite,cardBG:cc.Sprite,redTextColor:cc.Color.WHITE,blackTextColor:cc.Color.WHITE,texFrontBG:cc.SpriteFrame,texBackBG:cc.SpriteFrame,texFaces:{default:[],type:cc.SpriteFrame},texSuitBig:{default:[],type:cc.SpriteFrame},texSuitSmall:{default:[],type:cc.SpriteFrame}},init:function(t){var e=t.point>10;this.mainPic.spriteFrame=e?this.texFaces[t.point-10-1]:this.texSuitBig[t.suit-1],this.point.string=t.pointName,t.isRedSuit?this.point.node.color=this.redTextColor:this.point.node.color=this.blackTextColor,this.suit.spriteFrame=this.texSuitSmall[t.suit-1]},reveal:function(t){this.point.node.active=t,this.suit.node.active=t,this.mainPic.node.active=t,this.cardBG.spriteFrame=t?this.texFrontBG:this.texBackBG}}),cc._RF.pop()},{}],Dealer:[function(t,e){"use strict";cc._RF.push(e,"ce2dfoqEulHCLjS1Z9xPN7t","Dealer");var n=t("Actor"),i=t("Utils");cc.Class({extends:n,properties:{bestPoint:{get:function(){var t=this.holeCard?[this.holeCard].concat(this.cards):this.cards;return i.getMinMaxPoint(t).max},override:!0}},init:function(){this._super(),this.renderer.initDealer()},wantHit:function(){var e=t("Game"),n=t("Types"),i=this.bestPoint;if(21===i)return!1;if(i<=11)return!0;var o=e.instance.player;switch(e.instance.getPlRe(o,this)){case n.Outcome.Win:return!0;case n.Outcome.Lose:return!1}return this.bestPoint<17}}),cc._RF.pop()},{Actor:"Actor",Game:"Game",Types:"Types",Utils:"Utils"}],Decks:[function(t,e){"use strict";cc._RF.push(e,"17024G0JFpHcLI5GREbF8VN","Decks");var n=t("Types");function i(t){this._numberOfDecks=t,this._cardIds=new Array(52*t),this.reset()}i.prototype.reset=function(){this._cardIds.length=52*this._numberOfDecks;for(var t=0,e=n.Card.fromId,i=0;i<this._numberOfDecks;++i)for(var o=0;o<52;++o)this._cardIds[t]=e(o),++t},i.prototype.draw=function(){var t=this._cardIds,e=t.length;if(0===e)return null;var n=Math.random()*e|0,i=t[n],o=t[e-1];return t[n]=o,t.length=e-1,i},e.exports=i,cc._RF.pop()},{Types:"Types"}],FXPlayer:[function(t,e){"use strict";cc._RF.push(e,"68da2yjdGVMSYhXLN9DukIB","FXPlayer"),cc.Class({extends:cc.Component,init:function(){this.anim=this.getComponent(cc.Animation),this.sprite=this.getComponent(cc.Sprite)},show:function(t){this.sprite.enabled=t},playFX:function(t){this.anim.stop(),this.anim.play(t)},hideFX:function(){this.sprite.enabled=!1}}),cc._RF.pop()},{}],Game:[function(t,e){"use strict";cc._RF.push(e,"63738OONCFKHqsf4QSeJSun","Game");var n=t("PlayerData").players,i=t("Decks"),o=t("Types"),s=o.ActorPlayingState,a=t("game-fsm"),r=t("audioManager"),c=cc.Class({extends:cc.Component,properties:{playerAnchors:{default:[],type:cc.Node},playerPrefab:cc.Prefab,dealer:cc.Node,inGameUI:cc.Node,betUI:cc.Node,assetMng:cc.Node,turnDuration:0,betDuration:0,totalChipsNum:0,totalDiamondNum:0,numberOfDecks:{default:1,type:cc.Integer},SettingAnimation:{default:null,type:cc.Animation},youwinAnimation:{default:null,type:cc.Animation},setting:{default:null,type:cc.Node}},statics:{instance:null},onLoad:function(){c.instance=this,this.inGameUI=this.inGameUI.getComponent("InGameUI"),this.assetMng=this.assetMng.getComponent("AssetMng"),this.betUI=this.betUI.getComponent("Bet"),this.inGameUI.init(this.betDuration),this.betUI.init(),this.dealer=this.dealer.getComponent("Dealer"),this.dealer.init(),this.player=null,this.makePlayyyyer(),this.info=this.inGameUI.resultTxt,this.totalChips=this.inGameUI.labelTotalChips,this.decks=new i(this.numberOfDecks),this.fsm=a,this.fsm.init(this),this.ttUpToDate(),r.instance.PlayMusic("BackgroundMusic")},temsteke:function(t){return this.totalChipsNum<t?(console.log("not enough chips!"),this.info.enabled=!0,this.info.string="Gold not enough!",!1):(this.totalChipsNum-=t,this.ttUpToDate(),this.player.temsteke(t),r.instance.PlaySFX("chipsound"),this.info.enabled=!1,this.info.string="Please bet",!0)},resetStake:function(){this.totalChipsNum+=this.player.stakeNum,this.player.resetStake(),this.ttUpToDate()},ttUpToDate:function(){this.totalChips.string=this.totalChipsNum,this.player.renderer.updateTotalStake(this.totalChipsNum)},makePlayyyyer:function(){var t=cc.instantiate(this.playerPrefab),e=this.playerAnchors[2];e.addChild(t),t.position=cc.v2(0,0);var i=cc.find("anchorPlayerInfo",e).getPosition(),o=cc.find("anchorStake",e).getPosition();t.getComponent("ActorRenderer").init(n[2],i,o,this.turnDuration,!1),this.player=t.getComponent("Player"),this.player.init()},hit:function(){r.instance.PlaySFX("buttonsound"),this.player.addCard(this.decks.draw()),this.player.state===s.Bust&&this.fsm.onPlayerActed()},chorr:function(){this.player.chorr(),r.instance.PlaySFX("buttonsound"),this.fsm.onPlayerActed()},deal:function(){this.fsm.toDeal(),r.instance.PlaySFX("buttonsound")},start:function(){this.fsm.toBet(),r.instance.PlaySFX("buttonsound")},report:function(){this.player.report(),this.fsm.onPlayerActed()},quitToMenu:function(){r.instance.PlaySFX("buttonsound"),cc.director.loadScene("menu")},onTwiceStar:function(){this.betUI.resetTossedChips(),this.inGameUI.resetCountdown(),this.player.addCard(this.decks.draw());var t=this.decks.draw();this.dealer.addHoleCard(t),this.player.addCard(this.decks.draw()),this.dealer.addCard(this.decks.draw()),r.instance.PlaySFX("cardsound"),this.fsm.onDealed()},onItzyStar:function(t){t&&this.inGameUI.showGameState()},onNewJeanStar:function(){for(;this.dealer.state===s.Normal;)this.dealer.wantHit()?this.dealer.addCard(this.decks.draw()):this.dealer.chorr();this.fsm.onDealerActed()},onBlackPinkBlink:function(t){if(t)switch(this.dealer.revealHoldCard(),this.inGameUI.showResultState(),this.getPlRe(this.player,this.dealer)){case o.Outcome.Win:this.info.string="You Win",this.youwinAnimation.play("youwin"),r.instance.PlaySFX("winsound"),r.instance.StopMusic("BackgroundMusic"),this.totalChipsNum+=this.player.stakeNum;var e=this.player.stakeNum;!this.player.state===o.ActorPlayingState.Report&&(this.player.hand===o.Hand.BlackJack?e*=1.5:e*=2),this.totalChipsNum+=e,this.ttUpToDate();break;case o.Outcome.Lose:this.info.string="You Lose",this.youwinAnimation.play("youwin"),r.instance.PlaySFX("losesound"),r.instance.StopMusic("BackgroundMusic");break;case o.Outcome.Tie:this.info.string="Draw",this.youwinAnimation.play("youwin"),this.totalChipsNum+=this.player.stakeNum,this.ttUpToDate()}this.info.enabled=t},onBTSte:function(t){t&&(this.decks.reset(),this.player.reset(),this.dealer.reset(),this.info.string="Please bet",this.inGameUI.showBetState(),this.inGameUI.startCountdown(),r.instance.ResumeMusic("BackgroundMusic")),this.info.enabled=t},getPlRe:function(t,e){var n=o.Outcome;return t.state===s.Bust?n.Lose:e.state===s.Bust?n.Win:t.state===s.Report?n.Win:t.hand>e.hand?n.Win:t.hand<e.hand?n.Lose:t.bestPoint===e.bestPoint?n.Tie:t.bestPoint<e.bestPoint?n.Lose:n.Win},showSetting:function(){r.instance.PlaySFX("settingsound"),this.setting.setPosition(0,0),this.SettingAnimation.play("ScaleOut")},hideSetting:function(){r.instance.PlaySFX("settingsound"),this.SettingAnimation.play("ScaleIn")},clicksound:function(){r.instance.PlaySFX("buttonsound")}});cc._RF.pop()},{Decks:"Decks",PlayerData:"PlayerData",Types:"Types",audioManager:"audioManager","game-fsm":"game-fsm"}],InGameUI:[function(t,e){"use strict";cc._RF.push(e,"f192efroeFEyaxtfh8TVXYz","InGameUI"),t("Game"),cc.Class({extends:cc.Component,properties:{betStateUI:cc.Node,gameStateUI:cc.Node,resultTxt:cc.Label,betCounter:cc.ProgressBar,btnStart:cc.Node,labelTotalChips:cc.Label},init:function(t){this.resultTxt.enabled=!1,this.betStateUI.active=!0,this.gameStateUI.active=!1,this.btnStart.active=!1,this.betDuration=t,this.betTimer=0,this.isBetCounting=!1},startCountdown:function(){this.betCounter&&(this.betTimer=0,this.isBetCounting=!0)},resetCountdown:function(){this.betCounter&&(this.betTimer=0,this.isBetCounting=!1,this.betCounter.progress=0)},showBetState:function(){this.betStateUI.active=!0,this.gameStateUI.active=!1,this.btnStart.active=!1},showGameState:function(){this.betStateUI.active=!1,this.gameStateUI.active=!0,this.btnStart.active=!1},showResultState:function(){this.betStateUI.active=!1,this.gameStateUI.active=!1,this.btnStart.active=!0},update:function(t){this.isBetCounting&&(this.betCounter.progress=this.betTimer/this.betDuration,this.betTimer+=t,this.betTimer>=this.betDuration&&(this.isBetCounting=!1,this.betCounter.progress=1))}}),cc._RF.pop()},{Game:"Game"}],Menu:[function(t,e){"use strict";cc._RF.push(e,"20f60m+3RlGO7x2/ARzZ6Qc","Menu"),t("../scripts/audioManager"),cc.Class({extends:cc.Component,properties:{audioMng:cc.Node,menuMusic:{default:null,type:cc.AudioClip}},onLoad:function(){cc.audioEngine.setLoop(!0),cc.audioEngine.playMusic(this.menuMusic,!0),cc.director.preloadScene("table",function(){cc.log("Next scene preloaded")})},playGame:function(){cc.audioEngine.stopAll(),cc.director.loadScene("table")},update:function(){},exitGame:function(){cc.game.end()}}),cc._RF.pop()},{"../scripts/audioManager":"audioManager"}],ModalUI:[function(t,e){"use strict";cc._RF.push(e,"54397cUxehGzqEqpMUGHejs","ModalUI"),cc.Class({extends:cc.Component,properties:{mask:cc.Node},onLoad:function(){},onEnable:function(){this.mask.on("touchstart",function(t){t.stopPropagation()}),this.mask.on("touchend",function(t){t.stopPropagation()})},onDisable:function(){this.mask.off("touchstart",function(t){t.stopPropagation()}),this.mask.off("touchend",function(t){t.stopPropagation()})}}),cc._RF.pop()},{}],PlayerData:[function(t,e){"use strict";cc._RF.push(e,"4f9c5eXxqhHAKLxZeRmgHDB","PlayerData"),e.exports={players:[{name:"liza",gold:3e3,photoIdx:0},{name:"rose",gold:2e3,photoIdx:1},{name:"You",gold:1500,photoIdx:2},{name:"jisoo",gold:500,photoIdx:3},{name:"selena",gold:9e3,photoIdx:4},{name:"ariana",gold:5e3,photoIdx:5},{name:"nicky",gold:1e4,photoIdx:6}]},cc._RF.pop()},{}],Player:[function(t,e){"use strict";cc._RF.push(e,"226a2AvzRpHL7SJGTMy5PDX","Player");var n=t("Actor");cc.Class({extends:n,init:function(){this._super(),this.labelStake=this.renderer.labelStakeOnTable,this.stakeNum=0},reset:function(){this._super(),this.resetStake()},addCard:function(t){this._super(t)},temsteke:function(t){this.stakeNum+=t,this.updateStake(this.stakeNum)},resetStake:function(){this.stakeNum=0,this.updateStake(this.stakeNum)},updateStake:function(t){this.labelStake.string=t}}),cc._RF.pop()},{Actor:"Actor"}],SideSwitcher:[function(t,e){"use strict";cc._RF.push(e,"3aae7lZKyhPqqsLD3wMKl6X","SideSwitcher"),cc.Class({extends:cc.Component,properties:{retainSideNodes:{default:[],type:cc.Node}},switchSide:function(){this.node.scaleX=-this.node.scaleX;for(var t=0;t<this.retainSideNodes.length;++t){var e=this.retainSideNodes[t];e.scaleX=-e.scaleX}}}),cc._RF.pop()},{}],TossChip:[function(t,e){"use strict";cc._RF.push(e,"b4eb5Lo6U1IZ4eJWuxShCdH","TossChip"),cc.Class({extends:cc.Component,properties:{anim:cc.Animation},play:function(){this.anim.play("chip_toss")}}),cc._RF.pop()},{}],Types:[function(t,e){"use strict";cc._RF.push(e,"5b633QMQxpFmYetofEvK2UD","Types");var n=cc.Enum({Spade:1,Heart:2,Club:3,Diamond:4}),i="NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K".split(",");function o(t,e){Object.defineProperties(this,{point:{value:t,writable:!1},suit:{value:e,writable:!1},id:{value:13*(e-1)+(t-1),writable:!1},pointName:{get:function(){return i[this.point]}},suitName:{get:function(){return n[this.suit]}},isBlackSuit:{get:function(){return this.suit===n.Spade||this.suit===n.Club}},isRedSuit:{get:function(){return this.suit===n.Heart||this.suit===n.Diamond}}})}o.prototype.toString=function(){return this.suitName+" "+this.pointName};var s=new Array(52);o.fromId=function(t){return s[t]},function(){for(var t=1;t<=4;t++)for(var e=1;e<=13;e++){var n=new o(e,t);s[n.id]=n}}();var a=cc.Enum({Normal:-1,Chorrr:-1,Report:-1,Bust:-1}),r=cc.Enum({Win:-1,Lose:-1,Tie:-1}),c=cc.Enum({Normal:-1,BlackJack:-1,FiveCard:-1});e.exports={Suit:n,Card:o,ActorPlayingState:a,Hand:c,Outcome:r},cc._RF.pop()},{}],Utils:[function(t,e){"use strict";cc._RF.push(e,"73590esk6xP9ICqhfUZalMg","Utils"),e.exports={isBust:function(t){for(var e=0,n=0;n<t.length;n++){var i=t[n];e+=Math.min(10,i.point)}return e>21},getMinMaxPoint:function(t){for(var e=!1,n=0,i=0;i<t.length;i++){var o=t[i];1===o.point&&(e=!0),n+=Math.min(10,o.point)}var s=n;return e&&n+10<=21&&(s+=10),{min:n,max:s}},isMobile:function(){return cc.sys.isMobile}},cc._RF.pop()},{}],audioManager:[function(t,e){"use strict";cc._RF.push(e,"0e87ctQfnJLJ45AqoiPnnE0","audioManager");var n=t("sound"),i=cc.Class({extends:cc.Component,properties:{musicSound:[n],sfxSound:[n],musicSource:{default:null,type:cc.AudioSource},sfxSource:{default:null,type:cc.AudioSource},musicSlider:{default:null,type:cc.Slider},sfxSlider:{default:null,type:cc.Slider}},statics:{instance:null},onLoad:function(){i.instance=this,this.musicSource.volume=.4},start:function(){},startVolume:function(){},PlayMusic:function(t){var e=this.musicSound.find(function(e){return e.n===t});null==e?console.log("not found"):(this.musicSource.clip=e.clip,this.musicSource.play())},ResumeMusic:function(t){var e=this.musicSound.find(function(e){return e.n===t});null==e?console.log("not found"):(this.musicSource.clip=e.clip,this.musicSource.resume())},StopMusic:function(t){var e=this.musicSound.find(function(e){return e.n===t});null==e?console.log("not found"):(this.musicSource.clip=e.clip,this.musicSource.pause())},PlaySFX:function(t){var e=this.sfxSound.find(function(e){return e.n===t});null==e?console.log("not found"):(this.sfxSource.clip=e.clip,this.sfxSource.play())},MusicVolume:function(){this.musicSource.volume=this.musicSlider.progress},SFXVolume:function(){this.sfxSource.volume=this.sfxSlider.progress}});cc._RF.pop()},{sound:"sound"}],"game-fsm":[function(t,e,n){"use strict";cc._RF.push(e,"6510d1SmQRMMYH8FEIA7zXq","game-fsm");var i,o,s,a=t("state.com");function r(t){return function(e){return e===t}}var c=!1;n={init:function(t){a.console=console,o=new a.StateMachine("root");var e=new a.PseudoState("init-root",o,a.PseudoStateKind.Initial),n=new a.State("place a bet",o);s=new a.State("Started",o);var c=new a.State("settlement",o);e.to(n),n.to(s).when(r("deal")),s.to(c).when(r("end")),c.to(n).when(r("bet")),n.entry(function(){t.onBTSte(!0)}),n.exit(function(){t.onBTSte(!1)}),c.entry(function(){t.onBlackPinkBlink(!0)}),c.exit(function(){t.onBlackPinkBlink(!1)});var u=new a.PseudoState("init \u5df2\u5f00\u5c40",s,a.PseudoStateKind.Initial),h=new a.State("Licensing",s),l=new a.State("player decision",s),p=new a.State("dealer decision",s);u.to(h),h.to(l).when(r("dealed")),l.to(p).when(r("player acted")),h.entry(function(){t.onTwiceStar()}),l.entry(function(){t.onItzyStar(!0)}),l.exit(function(){t.onItzyStar(!1)}),p.entry(function(){t.onNewJeanStar()}),i=new a.StateMachineInstance("fsm"),a.initialise(o,i)},toDeal:function(){this._evaluate("deal")},toBet:function(){this._evaluate("bet")},onDealed:function(){this._evaluate("dealed")},onPlayerActed:function(){this._evaluate("player acted")},onDealerActed:function(){this._evaluate("end")},_evaluate:function(t){c?setTimeout(function(){a.evaluate(o,i,t)},1):(c=!0,a.evaluate(o,i,t),c=!1)},_getInstance:function(){return i},_getModel:function(){return o}},e.exports=n,cc._RF.pop()},{"state.com":"state.com"}],sound:[function(t,e){"use strict";cc._RF.push(e,"6481fccwZ9MaqGENVGfH0nJ","sound"),cc.Class({properties:{n:{default:"",type:cc.String},clip:{default:null,type:cc.AudioClip}}}),cc._RF.pop()},{}],"state.com":[function(t,e){"use strict";cc._RF.push(e,"71d9293mx9CFryhJvRw85ZS","state.com"),function(t){var e=function(){function t(t){this.actions=[],t&&this.push(t)}return t.prototype.push=function(e){return Array.prototype.push.apply(this.actions,e instanceof t?e.actions:arguments),this},t.prototype.hasActions=function(){return 0!==this.actions.length},t.prototype.invoke=function(t,e,n){void 0===n&&(n=!1),this.actions.forEach(function(i){return i(t,e,n)})},t}();t.Behavior=e}(n||(n={})),function(t){(function(t){t[t.Initial=0]="Initial",t[t.ShallowHistory=1]="ShallowHistory",t[t.DeepHistory=2]="DeepHistory",t[t.Choice=3]="Choice",t[t.Junction=4]="Junction",t[t.Terminate=5]="Terminate"})(t.PseudoStateKind||(t.PseudoStateKind={})),t.PseudoStateKind}(n||(n={})),function(t){(function(t){t[t.Internal=0]="Internal",t[t.Local=1]="Local",t[t.External=2]="External"})(t.TransitionKind||(t.TransitionKind={})),t.TransitionKind}(n||(n={})),function(t){var e=function(){function t(e,n){this.name=e,this.qualifiedName=n?n.qualifiedName+t.namespaceSeparator+e:e}return t.prototype.toString=function(){return this.qualifiedName},t.namespaceSeparator=".",t}();t.Element=e}(n||(n={}));var n,i=function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);function i(){this.constructor=t}i.prototype=e.prototype,t.prototype=new i};(function(t){var e=function(t){function e(e,n){t.call(this,e,n),this.vertices=[],this.state=n,this.state.regions.push(this),this.state.getRoot().clean=!1}return i(e,t),e.prototype.getRoot=function(){return this.state.getRoot()},e.prototype.accept=function(t,e,n,i){return t.visitRegion(this,e,n,i)},e.defaultName="default",e}(t.Element);t.Region=e})(n||(n={})),function(t){var e=function(e){function n(n,i){e.call(this,n,i=i instanceof t.State?i.defaultRegion():i),this.outgoing=[],this.region=i,this.region&&(this.region.vertices.push(this),this.region.getRoot().clean=!1)}return i(n,e),n.prototype.getRoot=function(){return this.region.getRoot()},n.prototype.to=function(e,n){return void 0===n&&(n=t.TransitionKind.External),new t.Transition(this,e,n)},n.prototype.accept=function(){},n}(t.Element);t.Vertex=e}(n||(n={})),function(t){var e=function(e){function n(n,i,o){void 0===o&&(o=t.PseudoStateKind.Initial),e.call(this,n,i),this.kind=o}return i(n,e),n.prototype.isHistory=function(){return this.kind===t.PseudoStateKind.DeepHistory||this.kind===t.PseudoStateKind.ShallowHistory},n.prototype.isInitial=function(){return this.kind===t.PseudoStateKind.Initial||this.isHistory()},n.prototype.accept=function(t,e,n,i){return t.visitPseudoState(this,e,n,i)},n}(t.Vertex);t.PseudoState=e}(n||(n={})),function(t){var e=function(e){function n(n,i){e.call(this,n,i),this.exitBehavior=new t.Behavior,this.entryBehavior=new t.Behavior,this.regions=[]}return i(n,e),n.prototype.defaultRegion=function(){return this.regions.reduce(function(e,n){return n.name===t.Region.defaultName?n:e},void 0)||new t.Region(t.Region.defaultName,this)},n.prototype.isFinal=function(){return 0===this.outgoing.length},n.prototype.isSimple=function(){return 0===this.regions.length},n.prototype.isComposite=function(){return this.regions.length>0},n.prototype.isOrthogonal=function(){return this.regions.length>1},n.prototype.exit=function(t){return this.exitBehavior.push(t),this.getRoot().clean=!1,this},n.prototype.entry=function(t){return this.entryBehavior.push(t),this.getRoot().clean=!1,this},n.prototype.accept=function(t,e,n,i){return t.visitState(this,e,n,i)},n}(t.Vertex);t.State=e}(n||(n={})),function(t){var e=function(t){function e(e,n){t.call(this,e,n)}return i(e,t),e.prototype.accept=function(t,e,n,i){return t.visitFinalState(this,e,n,i)},e}(t.State);t.FinalState=e}(n||(n={})),function(t){var e=function(t){function e(e){t.call(this,e,void 0),this.clean=!1}return i(e,t),e.prototype.getRoot=function(){return this.region?this.region.getRoot():this},e.prototype.accept=function(t,e,n,i){return t.visitStateMachine(this,e,n,i)},e}(t.State);t.StateMachine=e}(n||(n={})),function(t){var e=function(){function e(n,i,o){var s=this;void 0===o&&(o=t.TransitionKind.External),this.transitionBehavior=new t.Behavior,this.onTraverse=new t.Behavior,this.source=n,this.target=i,this.kind=i?o:t.TransitionKind.Internal,this.guard=n instanceof t.PseudoState?e.TrueGuard:function(t){return t===s.source},this.source.outgoing.push(this),this.source.getRoot().clean=!1}return e.prototype.else=function(){return this.guard=e.FalseGuard,this},e.prototype.when=function(t){return this.guard=t,this},e.prototype.effect=function(t){return this.transitionBehavior.push(t),this.source.getRoot().clean=!1,this},e.prototype.accept=function(t,e,n,i){return t.visitTransition(this,e,n,i)},e.prototype.toString=function(){return"["+(this.target?this.source+" -> "+this.target:this.source)+"]"},e.TrueGuard=function(){return!0},e.FalseGuard=function(){return!1},e}();t.Transition=e}(n||(n={})),function(t){var e=function(){function t(){}return t.prototype.visitElement=function(){},t.prototype.visitRegion=function(t,e,n,i){var o=this,s=this.visitElement(t,e,n,i);return t.vertices.forEach(function(t){t.accept(o,e,n,i)}),s},t.prototype.visitVertex=function(t,e,n,i){var o=this,s=this.visitElement(t,e,n,i);return t.outgoing.forEach(function(t){t.accept(o,e,n,i)}),s},t.prototype.visitPseudoState=function(t,e,n,i){return this.visitVertex(t,e,n,i)},t.prototype.visitState=function(t,e,n,i){var o=this,s=this.visitVertex(t,e,n,i);return t.regions.forEach(function(t){t.accept(o,e,n,i)}),s},t.prototype.visitFinalState=function(t,e,n,i){return this.visitState(t,e,n,i)},t.prototype.visitStateMachine=function(t,e,n,i){return this.visitState(t,e,n,i)},t.prototype.visitTransition=function(){},t}();t.Visitor=e}(n||(n={})),function(t){var e=function(){function t(t){void 0===t&&(t="unnamed"),this.last={},this.isTerminated=!1,this.name=t}return t.prototype.setCurrent=function(t,e){this.last[t.qualifiedName]=e},t.prototype.getCurrent=function(t){return this.last[t.qualifiedName]},t.prototype.toString=function(){return this.name},t}();t.StateMachineInstance=e}(n||(n={})),function(t){t.setRandom=function(t){e=t},t.getRandom=function(){return e};var e=function(t){return Math.floor(Math.random()*t)}}(n||(n={})),function(t){t.isActive=function e(n,i){return n instanceof t.Region?e(n.state,i):n instanceof t.State?!n.region||e(n.region,i)&&i.getCurrent(n.region)===n:void 0}}(n||(n={})),function(t){t.isComplete=function e(n,i){return n instanceof t.Region?i.getCurrent(n).isFinal():!(n instanceof t.State)||n.regions.every(function(t){return e(t,i)})}}(n||(n={})),function(t){function e(n,i,o){void 0===o&&(o=!0),i?(o&&!1===n.clean&&e(n),t.console.log("initialise "+i),n.onInitialise.invoke(void 0,i)):(t.console.log("initialise "+n.name),n.accept(new d,!1),n.clean=!0)}function n(e,i,s){var a=!1;if(e.regions.every(function(o){return!n(i.getCurrent(o),i,s)||(a=!0,t.isActive(e,i))}),a)s!==e&&t.isComplete(e,i)&&n(e,i,e);else{var r=e.outgoing.filter(function(t){return t.guard(s,i)});1===r.length?a=o(r[0],i,s):r.length>1&&t.console.error(e+": multiple outbound transitions evaluated true for message "+s)}return a}function o(e,i,a){for(var r=new t.Behavior(e.onTraverse),c=e.target;c&&c instanceof t.PseudoState&&c.kind===t.PseudoStateKind.Junction;)c=(e=s(c,i,a)).target,r.push(e.onTraverse);return r.invoke(a,i),c&&c instanceof t.PseudoState&&c.kind===t.PseudoStateKind.Choice?o(s(c,i,a),i,a):c&&c instanceof t.State&&t.isComplete(c,i)&&n(c,i,c),!0}function s(e,n,i){var o=e.outgoing.filter(function(t){return t.guard(i,n)});return e.kind===t.PseudoStateKind.Choice?0!==o.length?o[t.getRandom()(o.length)]:a(e):o.length>1?void t.console.error("Multiple outbound transition guards returned true at "+this+" for "+i):o[0]||a(e)}function a(e){return e.outgoing.filter(function(e){return e.guard===t.Transition.FalseGuard})[0]}function r(e){return e[0]||(e[0]=new t.Behavior)}function c(e){return e[1]||(e[1]=new t.Behavior)}function u(e){return e[2]||(e[2]=new t.Behavior)}function h(e){return new t.Behavior(c(e)).push(u(e))}function l(t){return(t.region?l(t.region.state):[]).concat(t)}t.initialise=e,t.evaluate=function(i,o,s,a){return void 0===a&&(a=!0),t.console.log(o+" evaluate "+s),a&&!1===i.clean&&e(i),!o.isTerminated&&n(i,o,s)};var p=function(e){function n(){e.apply(this,arguments)}return i(n,e),n.prototype.visitTransition=function(e,n){e.kind===t.TransitionKind.Internal?e.onTraverse.push(e.transitionBehavior):e.kind===t.TransitionKind.Local?this.visitLocalTransition(e,n):this.visitExternalTransition(e,n)},n.prototype.visitLocalTransition=function(e,n){var i=this;e.onTraverse.push(function(o,s){for(var a=l(e.target),c=0;t.isActive(a[c],s);)++c;for(r(n(s.getCurrent(a[c].region))).invoke(o,s),e.transitionBehavior.invoke(o,s);c<a.length;)i.cascadeElementEntry(e,n,a[c++],a[c],function(t){t.invoke(o,s)});u(n(e.target)).invoke(o,s)})},n.prototype.visitExternalTransition=function(t,e){for(var n=l(t.source),i=l(t.target),o=Math.min(n.length,i.length)-1;n[o-1]!==i[o-1];)--o;for(t.onTraverse.push(r(e(n[o]))),t.onTraverse.push(t.transitionBehavior);o<i.length;)this.cascadeElementEntry(t,e,i[o++],i[o],function(e){return t.onTraverse.push(e)});t.onTraverse.push(u(e(t.target)))},n.prototype.cascadeElementEntry=function(e,n,i,o,s){s(c(n(i))),o&&i instanceof t.State&&i.regions.forEach(function(t){s(c(n(t))),t!==o.region&&s(u(n(t)))})},n}(t.Visitor),d=function(e){function n(){e.apply(this,arguments),this.behaviours={}}return i(n,e),n.prototype.behaviour=function(t){return this.behaviours[t.qualifiedName]||(this.behaviours[t.qualifiedName]=[])},n.prototype.visitElement=function(e){t.console!==f&&(r(this.behaviour(e)).push(function(n,i){return t.console.log(i+" leave "+e)}),c(this.behaviour(e)).push(function(n,i){return t.console.log(i+" enter "+e)}))},n.prototype.visitRegion=function(e,n){var i=this,o=e.vertices.reduce(function(e,n){return n instanceof t.PseudoState&&n.isInitial()?n:e},void 0);e.vertices.forEach(function(e){e.accept(i,n||o&&o.kind===t.PseudoStateKind.DeepHistory)}),r(this.behaviour(e)).push(function(t,n){return r(i.behaviour(n.getCurrent(e))).invoke(t,n)}),n||!o||o.isHistory()?u(this.behaviour(e)).push(function(n,s,a){h(i.behaviour((a||o.isHistory())&&s.getCurrent(e)||o)).invoke(n,s,a||o.kind===t.PseudoStateKind.DeepHistory)}):u(this.behaviour(e)).push(h(this.behaviour(o))),this.visitElement(e,n)},n.prototype.visitPseudoState=function(n,i){e.prototype.visitPseudoState.call(this,n,i),n.isInitial()?u(this.behaviour(n)).push(function(t,e){return o(n.outgoing[0],e)}):n.kind===t.PseudoStateKind.Terminate&&c(this.behaviour(n)).push(function(t,e){return e.isTerminated=!0})},n.prototype.visitState=function(t,e){var n=this;t.regions.forEach(function(i){i.accept(n,e),r(n.behaviour(t)).push(r(n.behaviour(i))),u(n.behaviour(t)).push(h(n.behaviour(i)))}),this.visitVertex(t,e),r(this.behaviour(t)).push(t.exitBehavior),c(this.behaviour(t)).push(t.entryBehavior),c(this.behaviour(t)).push(function(e,n){t.region&&n.setCurrent(t.region,t)})},n.prototype.visitStateMachine=function(t,n){var i=this;e.prototype.visitStateMachine.call(this,t,n),t.accept(new p,function(t){return i.behaviour(t)}),t.onInitialise=h(this.behaviour(t))},n}(t.Visitor),f={log:function(){for(var t=[],e=1;e<arguments.length;e++)t[e-1]=arguments[e]},warn:function(){for(var t=[],e=1;e<arguments.length;e++)t[e-1]=arguments[e]},error:function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];throw t}};t.console=f}(n||(n={})),function(t){function e(t){return(t.region?e(t.region.state):[]).concat(t)}t.validate=function(t){t.accept(new n)};var n=function(n){function o(){n.apply(this,arguments)}return i(o,n),o.prototype.visitPseudoState=function(e){n.prototype.visitPseudoState.call(this,e),e.kind===t.PseudoStateKind.Choice||e.kind===t.PseudoStateKind.Junction?(0===e.outgoing.length&&t.console.error(e+": "+e.kind+" pseudo states must have at least one outgoing transition."),e.outgoing.filter(function(e){return e.guard===t.Transition.FalseGuard}).length>1&&t.console.error(e+": "+e.kind+" pseudo states cannot have more than one Else transitions.")):(0!==e.outgoing.filter(function(e){return e.guard===t.Transition.FalseGuard}).length&&t.console.error(e+": "+e.kind+" pseudo states cannot have Else transitions."),e.isInitial()&&(1!==e.outgoing.length?t.console.error(e+": initial pseudo states must have one outgoing transition."):e.outgoing[0].guard!==t.Transition.TrueGuard&&t.console.error(e+": initial pseudo states cannot have a guard condition.")))},o.prototype.visitRegion=function(e){var i;n.prototype.visitRegion.call(this,e),e.vertices.forEach(function(n){n instanceof t.PseudoState&&n.isInitial()&&(i&&t.console.error(e+": regions may have at most one initial pseudo state."),i=n)})},o.prototype.visitState=function(e){n.prototype.visitState.call(this,e),e.regions.filter(function(e){return e.name===t.Region.defaultName}).length>1&&t.console.error(e+": a state cannot have more than one region named "+t.Region.defaultName)},o.prototype.visitFinalState=function(e){n.prototype.visitFinalState.call(this,e),0!==e.outgoing.length&&t.console.error(e+": final states must not have outgoing transitions."),0!==e.regions.length&&t.console.error(e+": final states must not have child regions."),e.entryBehavior.hasActions()&&t.console.warn(e+": final states may not have entry behavior."),e.exitBehavior.hasActions()&&t.console.warn(e+": final states may not have exit behavior.")},o.prototype.visitTransition=function(i){n.prototype.visitTransition.call(this,i),i.kind===t.TransitionKind.Local&&-1===e(i.target).indexOf(i.source)&&t.console.error(i+": local transition target vertices must be a child of the source composite sate.")},o}(t.Visitor)}(n||(n={})),e.exports=n,cc._RF.pop()},{}],"use_v2.1-2.2.1_cc.Toggle_event":[function(t,e){"use strict";cc._RF.push(e,"3961a1JY8tI05jzC0KjDR3d","use_v2.1-2.2.1_cc.Toggle_event"),cc.Toggle&&(cc.Toggle._triggerEventInScript_isChecked=!0),cc._RF.pop()},{}]},{},["use_v2.1-2.2.1_cc.Toggle_event","Actor","ActorRenderer","AssetMng","AudioMng","Bet","Card","Dealer","FXPlayer","Game","Menu","Player","SideSwitcher","TossChip","ButtonScaler","InGameUI","ModalUI","audioManager","state.com","Decks","PlayerData","Types","Utils","game-fsm","sound"]);