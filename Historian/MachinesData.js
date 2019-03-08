var chartColors = {
	null: "#080808",
	working: "#686868",
	full: "#A8A8A8",
	empty: "#282828",
};
var machineData = prepareTemplatedMachineData();
var machineDisplayElements = {};

function preprocessMachinesData()
{
	var infuser = machineData["Golem Infuser"];
	infuser.displayRegionSwapCD = 128;
	infuser.displayRegionCurrentGolem = -1;
	infuser.displayRegionNextGolem = -1;
	infuser.displayRegionGolemList = ["GolemEarth", "GolemWater", "GolemAir", "GolemFire"];
	infuser.displayRegionCustomDraw = function (ctx)
	{
		ctx.save();
		ctx.translate(-32, -32);
		if (infuser.displayRegionCurrentGolem >= 0)
		{
			ctx.drawImage(images["icon" + infuser.displayRegionGolemList[infuser.displayRegionCurrentGolem]], 0, 0);
			ctx.fillStyle = ctx.strokeStyle;
			drawNumber(ctx, data.oElements[infuser.displayRegionGolemList[infuser.displayRegionCurrentGolem]].amount, 50, 24, "", "center");
		}
		if (infuser.displayRegionNextGolem >= 0 && infuser.displayRegionNextGolem !== infuser.displayRegionCurrentGolem)
		{
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(128 - infuser.displayRegionSwapCD, 0);
			ctx.lineTo(0, 128 - infuser.displayRegionSwapCD);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
			ctx.clip();
			ctx.drawImage(images["icon" + infuser.displayRegionGolemList[infuser.displayRegionNextGolem]], 0, 0);
			ctx.fillStyle = ctx.strokeStyle;
			drawNumber(ctx, data.oElements[infuser.displayRegionGolemList[infuser.displayRegionNextGolem]].amount, 50, 24, "", "center");
		}
		ctx.restore();
		if (infuser.displayRegionSwapCD-- == 0)
		{
			infuser.displayRegionSwapCD = 128;
			if (infuser.displayRegionNextGolem >= 0)
			{
				infuser.displayRegionCurrentGolem = infuser.displayRegionNextGolem;
				infuser.displayRegionNextGolem = -1;
				for (var i = 1; i <= 4; i++)
				{
					if (data.oElements[infuser.displayRegionGolemList[(infuser.displayRegionCurrentGolem + i) % 4]].amount > 0)
					{
						infuser.displayRegionNextGolem = (infuser.displayRegionCurrentGolem + i) % 4;
						break;
					}
				}
			}
			else
			{
				infuser.displayRegionCurrentGolem = -1;
				for (var i = 0; i < 4; i++)
				{
					if (data.oElements[infuser.displayRegionGolemList[i]].amount > 0)
					{
						infuser.displayRegionNextGolem = i;
						break;
					}
				}
			}
		}
		else if (infuser.displayRegionNextGolem === null)
		{
			for (var i = 0; i < 4; i++)
			{
				if (data.oElements[infuser.displayRegionGolemList[i]].amount > 0)
				{
					infuser.displayRegionNextGolem = i;
					infuser.displayRegionSwapCD = 128;
					break;
				}
			}
		}
	}
	var merger = machineData["Golem Merger"];
	merger.displayRegionCustomDraw = function (ctx)
	{
		ctx.save();
		ctx.translate(-32, -32);
		ctx.drawImage(images.iconMergerDisplay, 0, 0);
		ctx.restore();
	}

	for (var title in machineData)
	{
		initMachine(title);
		if (machineData[title].displayElement)
		{
			machineDisplayElements[machineData[title].displayElement] = title;
		}
	}
	machineDisplayElements["GolemEarth"] = "Golem Infuser";
	machineDisplayElements["GolemWater"] = "Golem Infuser";
	machineDisplayElements["GolemAir"] = "Golem Infuser";
	machineDisplayElements["GolemFire"] = "Golem Infuser";

	infuser.pane.regularDraw = infuser.pane.customDraw;
	infuser.pane.customDraw = function (ctx)
	{
		if (this.boundaryPathMax)
		{
			ctx.save();
			ctx.translate(132, 49);
			ctx.beginPath();
			ctx.arc(0, 0, 30, 0, Math.PI * 2);
			ctx.stroke();
			ctx.fill();
			ctx.clip();

			this.machine.region.customDraw(ctx);
			ctx.restore();
			this.regularDraw(ctx);
		}
	}
}
preprocessMachinesData();
