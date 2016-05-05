import _ from 'lodash'

import moment from 'moment'

import faker from 'faker'

import d3 from 'd3'

Template.container.onRendered(function() {

	let data = _.times(30, function() {
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

	let data5 = _.times(10, function() {
		return {
			start: faker.date.past(_.random(30)),
			value: _.random(700)
		}
	})

	let minDate = d3.min(data, function(d) {
		return d.start
	})

	let maxDate = d3.max(data, function(d) {
		return d.start
	})

	let $container = d3.select(this.find('.container'))

	let xScale = d3.time.scale()
		.domain([minDate, maxDate])
		.range([40, 600])

	let xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')

	let zoom = d3.behavior.zoom()
		.x(xScale)
		.on('zoom', zoomed)

	let $svg = $container.append('svg')
		.attr('width', 640)
		.attr('height', 480)
		.style('background-color', 'skyblue')
		.call(zoom)

	let $x = $svg.append('g')
		.attr('class', 'x axis')
		.attr('width', 600)
		.attr('height', 440)
		.attr('transform', 'translate(0, 0)')
		.call(xAxis)

	let $g1 = $svg
		.append('g')
		.attr('width', 640)
		.attr('height', 480)

	let $line = $g1
		.append('line')
		.attr('x1', 0)
		.attr('x2', 640)
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
		.attr('width', 640)
		.attr('height', 480)

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
		.attr('width', 640)
		.attr('height', 480)

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

	let $g5 = $svg
		.append('g')
		.attr('width', 640)
		.attr('height', 480)

	let $bars = $g3.selectAll('rect')
		.data(data5)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('width', 10)
		.attr('height', function (d) {
			return (d.value)
		})
		.attr('x', function(d) {
			return xScale(d.start)
		})
		.attr('y', function (d) {
			return 480 - d.value
		})
		.attr('fill', 'white')

	function zoomed(a, b, c) {
		$svg.select(".x.axis").call(xAxis)
		$svg.selectAll("circle.circle").attr('cx', function(d) {
			return xScale(d.start)
		})
		$svg.selectAll("rect.bar").attr('x', function(d) {
			return xScale(d.start)
		})
	}

})
