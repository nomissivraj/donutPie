var donutPie = {};

var completeColor = "#52B7A9",
    underwayColor = "#EC8755",
    notStartedColor = "#BC5858";
var donutData = [
    { name: 'Complete', stringId: 'complete', count: 9, fill: completeColor },
    { name: 'Underway', stringId: 'underway', count: 4, fill: underwayColor },
    { name: 'Not Started', stringId: 'not-started', count: 5, fill: notStartedColor }
];


(function (self) {
    self.init = function (container, data, opts) {
        var target = self.target(container);

        if (!target) return;
        if (!data) return;


        target.forEach(function (_this) {
            if (_this.offsetWidth <= 1) return; // Element must be hidden - Do Nothing

            var paddingL = window.getComputedStyle(_this, null).getPropertyValue('padding-left'),
                paddingR = window.getComputedStyle(_this, null).getPropertyValue('padding-right');
            paddingX = Math.ceil(parseInt(paddingL)) + Math.ceil(parseInt(paddingR));

            var elWidth = _this.offsetWidth - (paddingX + 2);

            var props = {
                id: _this.getAttribute('id'),
                svgWidth: elWidth,
                svgHeight: elWidth,
                stroke: 10,
                startPos: {
                    x: elWidth / 2,
                    y: elWidth / 2
                },
                segments: data,
                style: {
                    backgroundColor: !opts || !opts.backgroundColor ? "#cccccc" : opts.backgroundColor,
                },
                text: !opts || !opts.text ? "Complete" : opts.text
            };

            self.draw(props);
        });
    }

    self.draw = function (props) {
        // Ensure only one svg per element (stops duplication on redraw)
        document.querySelector('#' + props.id + ' svg') ? d3.select('#' + props.id + ' svg').remove() : null;
        d3.select('#' + props.id).append('svg').attr('id', props.id + '-svg').attr('width', props.svgWidth).attr('height', props.svgHeight);
        var canvas = d3.select('#' + props.id + '-svg');
        drawBase();
        drawSegments();
        drawStrokes();

        function drawBase() {
            drawArc(0, 100, props.style.backgroundColor, 'base', canvas);
        }

        function drawSegments() {
            var total = 0;
            // get total
            props.segments.forEach(function (_this) {
                total += _this.count;
            });

            var lastEndPos = 0;
            // Draw each segement/slice
            props.segments.forEach(function (_this) {
                // Work out what percentage each segment is based on total and number of segments
                var curPerc = (_this.count / total) * 100;
                //draw current segment arc
                drawArc(lastEndPos, lastEndPos + curPerc, _this.fill, _this.stringId, canvas);
                lastEndPos += curPerc;
            });

        }

        function drawStrokes() {
            var total = 0;
            // get total
            props.segments.forEach(function (_this) {
                total += _this.count;
            });

            var lastEndPos = 0;
            // append mask layer
            //canvas.append('mask').attr('id', 'mask-'+props.Id);
            canvas.append('g').attr('id', 'mask-'+props.Id);

            // Draw strokes
            props.segments.forEach(function (_this) {
                var curPerc = (_this.count / total) * 100;
                // append black arc to mask. //TODO CHANGE THIS TO LINE at correct ANGLE
                drawArc(lastEndPos - .5, lastEndPos + .5, 'white', _this.stringId, d3.select("#mask-"+props.Id));
                lastEndPos += curPerc;
            });
        }

        function drawArc(sAngle, eAngle, color, className, target, inset) {
            !inset ? inset = 0 : inset = inset;
            // Arc properties
            var arc = d3.svg.arc()
                .outerRadius(props.svgWidth / 2 - inset)
                .innerRadius(props.svgWidth / 2 - (props.svgWidth / 5 - inset))
                .startAngle(sAngle / 100 * Math.PI * 2)
                .endAngle(eAngle / 100 * Math.PI * 2);

            //Append path and arc to path
            target.append('path').attr('class', className).attr('fill', color).attr('d', arc).attr('transform', 'translate(' + props.startPos.x + "," + props.startPos.y + '), rotate(0)');
        }
    };

    self.target = function (container) {
        var result = document.querySelectorAll(container).length > 0 ? document.querySelectorAll(container) : document.querySelectorAll('.donutPie');
        if (!result.length > 0) return;

        return result;
    };

})(donutPie);


window.addEventListener("load", function () {
    setTimeout(function () {
        donutPie.init('.donutPie', donutData);
    }, 200);

});

window.addEventListener("resize", function () {
    donutPie.init('.donutPie', donutData);
});