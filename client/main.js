import _ from 'lodash'

import moment from 'moment'

import faker from 'faker'

import d3 from 'd3'

Template.container.onRendered(function() {

	let data = _.times(10, function() {
		return {
			start: faker.date.past(_.random(30))
		}
	})

	let data2 = _.times(10, function() {
		return {
			start: faker.date.past(_.random(30))
		}
	})

	let data3 = _.times(10, function() {
		return {
			start: faker.date.past(_.random(30))
		}
	})

	let data4in = _.times(10, function() {
		return {
			start: faker.date.past(_.random(30)),
			value: _.random(1000, 2000)
		}
	})

	data4in = _.sortBy(data4in, 'start')


	let data4out = _.times(10, function() {
		return {
			start: faker.date.past(_.random(30)),
			value: _.random(1000, 2000)
		}
	})

	let data5 = _.times(10, function() {
		return {
			start: faker.date.past(_.random(30)),
			value: _.random(1000, 2000)
		}
	})

	let minVal = d3.min(data5, function(d) {
		return d.value
	})

	let maxVal = d3.max(data5, function(d) {
		return d.value
	})

	let minDate = d3.min(data, function(d) {
		return d.start
	})

	let maxDate = d3.max(data, function(d) {
		return d.start
	})

	let minValIn = d3.min(data4in, function(d) {
		return d.value
	})

	let maxValIn = d3.max(data4in, function(d) {
		return d.value
	})

	let minValOut = d3.min(data4out, function(d) {
		return d.value
	})

	let maxValOut = d3.max(data4out, function(d) {
		return d.value
	})

	let $container = d3.select(this.find('.container'))

	let containerWidth = parseInt($container.style('width'), 10)

	let containerHeight = 480

	let xScale = d3.time.scale()
		.domain([minDate, maxDate])
		.range([40, containerWidth - 40])
		.nice()

	let xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')

	let zoom = d3.behavior.zoom()
		.x(xScale)
		.on('zoom', zoomed)

	let $svg = $container.append('svg')
		.attr('width', containerWidth)
		.attr('height', containerHeight)
		// .style('background-color', 'skyblue')
		.call(zoom)

	let $x = $svg.append('g')
		.attr('class', 'x axis')
		.call(xAxis)

	let $g1 = $svg
		.append('g')

	let $line = $g1
		.append('line')
		.attr('x1', 0)
		.attr('x2', containerWidth)
		.style('stroke', 'red')
		.style('stroke-width', 10)
		.style('transform', 'translate(0, 50px)')

	let $circles = $g1.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('class', 'circle')
		.attr('cx', function(d) {
			return xScale(d.start)
		})
		.attr('cy', 50)
		.attr('r', 5)

	let $g2 = $svg
		.append('g')

	let $circles2 = $g2.selectAll('circle')
		.data(data2)
		.enter()
		.append('circle')
		.attr('class', 'circle')
		.attr('cx', function(d) {
			return xScale(d.start)
		})
		.attr('cy', 100)
		.attr('r', 5)

	let $g3 = $svg
		.append('g')

	let $circles3 = $g3.selectAll('circle')
		.data(data3)
		.enter()
		.append('circle')
		.attr('class', 'circle')
		.attr('cx', function(d) {
			return xScale(d.start)
		})
		.attr('cy', 150)
		.attr('r', 5)

	// 4 in out

	let yScale4In = d3.scale.linear()
		.domain([minValIn, maxValIn])
		.range([80, 0])
		.nice()

	let yAxis4In = d3.svg.axis()
		.scale(yScale4In)
		.orient('right')
		.ticks(3)

	let $g4 = $svg
		.append('g')
		.attr('class', 'g4')
		.attr('transform', `translate(0, ${containerHeight - 180})`)
		.call(yAxis4In)

	var line4 = d3.svg.line()
		.x(function(d) {
			return xScale(d.start);
		})
		.y(function(d) {
			return yScale4In(d.value);
		})

	var $test = $g4.append('path')
		.attr('class', 'line4')
		.attr('d', line4(data4in))
		.attr('stroke', 'green')
		.attr('stroke-width', 1)
		.attr('shape-rendering', 'crispEdges')
		.attr('fill-rendering', 'none')


	let $circles4 = $g4.selectAll('circle')
		.data(data4in)
		.enter()
		.append('circle')
		.attr('class', 'circle4')
		.attr('cx', function(d) {
			return xScale(d.start)
		})
		.attr('cy', function(d) {
			return yScale4In(d.value)
		})
		.attr('r', 10)
		.attr('fill', 'red')

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
		.attr('width', 10)
		.attr('height', function(d) {
			return yScale(d.value)
		})
		.attr('x', function(d) {
			return xScale(d.start)
		})
		.attr('y', function(d) {
			let test = yScale(d.value).toFixed()
			return 80 - test
		})
		.attr('fill', 'red')

	function zoomed(a, b, c) {
		$svg.select(".x.axis").call(xAxis)
		$svg.selectAll("circle.circle").attr('cx', function(d) {
			return xScale(d.start)
		})

		$svg.selectAll("circle.circle4").attr('cx', function(d) {
			return xScale(d.start)
		})

		$test.attr('d', line4(data4in))

		$svg.selectAll("rect.bar").attr('x', function(d) {
			return xScale(d.start)
		})
	}

})
