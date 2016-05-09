import _ from 'lodash'

import moment from 'moment'

import faker from 'faker'

import d3 from 'd3'

Template.container.onRendered(function () {

	// data for lane 1

	let dataForProject = _.times(10, function () {
		return {
			start: faker.date.recent(90)
		}
	})

	// data for lane 4

	let dataForFinance = _.times(20, function () {
		return {
			type: _.sample(['incoming', 'outcoming']),
			start: faker.date.recent(90),
			value: _.random(1000, 5000)
		}
	})

	dataForFinance = _.sortBy(dataForFinance, 'start')

	let minValForFinance = d3.min(dataForFinance, (d) => d.value)

	let maxValForFinance = d3.max(dataForFinance, (d) => d.value)

	//

	let data4in = _.filter(dataForFinance, function (d) {
		return d.type == 'incoming'
	})

	let data4out = _.filter(dataForFinance, (d) => d.type == 'outcoming')

	// data for lane 5

	let data5 = _.times(30, function () {
		return {
			start: faker.date.recent(90),
			value: _.random(1000, 2000)
		}
	})

	let minVal = d3.min(data5, function (d) {
		return d.value
	})

	let maxVal = d3.max(data5, function (d) {
		return d.value
	})

	let dateRange = _.concat(dataForProject, dataForFinance, data5)

	console.log(dateRange)

	let minDate = d3.min(dateRange, (d) => d.start)

	let maxDate = d3.max(dateRange, (d) => d.start)

	// container

	let $container = d3.select(this.find('.container'))

	let containerWidth = parseInt($container.style('width'), 10)

	let containerHeight = 480

	let mainScale = d3.time.scale()
		.domain([minDate, maxDate])
		.range([40, containerWidth - 40])
		.nice()

	let xAxis = d3.svg.axis()
		.scale(mainScale)
		.orient('top')
		.innerTickSize(-containerHeight)
		.outerTickSize(0)

	let zoom = d3.behavior.zoom()
		.x(mainScale)
		.on('zoom', handleZoom)

	let $svg = $container.append('svg')
		.attr('width', containerWidth)
		.attr('height', containerHeight)
		.call(zoom)

	let $x = $svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0, 20)')
		.call(xAxis)

	// lane 1

	let $g1 = $svg
		.append('g')

	let $line = $g1
		.append('line')
		.attr('x1', 0)
		.attr('x2', containerWidth)
		.style('stroke', 'purple')
		.style('stroke-width', 8)
		.style('opacity', .4)
		.style('transform', 'translate(0, 50px)')

	// let group1 = $g1.selectAll('g')
	// 	.date(dataForProject)
	// 	.enter()
	// 	.append('g')

	let $circles = $g1.selectAll('circle')
		.data(dataForProject)
		.enter()
		.append('circle')
		.attr('class', 'circle')
		.attr('cx', function (d) {
			return mainScale(d.start)
		})
		.attr('cy', 50)
		.attr('r', 15)
		.attr('fill', 'purple')

	// lane 4 finance

	let yScaleForFinance = d3.scale.linear()
		.domain([minValForFinance, maxValForFinance])
		.range([80, 0])
		.nice()

	let yAxisForFinance = d3.svg.axis()
		.scale(yScaleForFinance)
		.orient('right')
		.ticks(3)

	let $g4 = $svg
		.append('g')
		.attr('class', 'g4')
		.attr('transform', `translate(0, ${containerHeight - 180})`)
		// .attr('width', containerWidth)
		.call(yAxisForFinance)

	let $incomingGroup = $g4.append('g')
	let $outcomingContainer = $g4.append('g')

	//

	let incomingLine = d3.svg.line()
		.x(function (d) {
			return mainScale(d.start);
		})
		.y(function (d) {
			return yScaleForFinance(d.value);
		})

	let $incomingLine = $incomingGroup.append('path')
		.attr('class', 'incomingLine')
		.attr('d', incomingLine(data4in))

	let $incomingPoints = $incomingGroup.selectAll('circle.incomingCircle')
		.data(data4in)
		.enter()
		.append('circle')
		.attr('class', 'incomingCircle')
		.attr('cx', function (d) {
			return mainScale(d.start)
		})
		.attr('cy', function (d) {
			return yScaleForFinance(d.value)
		})
		.attr('r', 10)
		.attr('fill', 'yellow')
		.attr('stroke', 'white')
		.attr('stroke-width', 2)

	// outcoming lane

	let outcomingLine = d3.svg.line()
		.x(function (d) {
			return mainScale(d.start)
		})
		.y(function (d) {
			return yScaleForFinance(d.value)
		})

	let $outcomingLine = $outcomingContainer.append('path')
		.attr('class', 'outcomingLine')
		.attr('d', outcomingLine(data4out))

	let $outcomingPoints = $outcomingContainer.selectAll('circle')
		.data(data4out)
		.enter()
		.append('circle')
		.attr('class', 'circle4out')
		.attr('cx', function (d) {
			return mainScale(d.start)
		})
		.attr('cy', function (d) {
			return yScaleForFinance(d.value)
		})
		.attr('r', 10)
		.attr('fill', 'orange')
		.attr('stroke', 'white')
		.attr('stroke-width', 2)

	// 5

	let yScale = d3.scale.linear()
		.domain([minVal, maxVal])
		.range([80, 0])
		.nice()

	let yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('right')
		.ticks(3)

	let $g5 = $svg
		.append('g')
		.attr('transform', `translate(0, ${containerHeight - 80})`)
		.call(yAxis)

	let $bars = $g5.selectAll('rect')
		.data(data5)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('width', 20)
		.attr('height', function (d) {
			return yScale(d.value)
		})
		.attr('x', function (d) {
			return mainScale(d.start)
		})
		.attr('y', function (d) {
			let test = yScale(d.value).toFixed()
			return 80 - test
		})
		.attr('fill', 'pink')

	// events handlers

	function handleZoom() {
		$x.call(xAxis)

		$circles.attr('cx', (d) => mainScale(d.start))

		$incomingLine.attr('d', incomingLine(data4in))

		$outcomingLine.attr('d', outcomingLine(data4out))

		$incomingPoints.attr('cx', (d) => mainScale(d.start))

		$outcomingPoints.attr('cx', (d) => mainScale(d.start))

		$bars.attr('x', (d) => mainScale(d.start))
	}

})
