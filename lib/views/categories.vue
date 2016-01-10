
<template>
	<div class="categories">
		<h2>Project Categories</h2>
		<p>Here's a <strong>rough mapping</strong> of courses to project categories, to help with sorting your projects. Keep in mind that this is a guideline&mdash;if, for instance, your project from <em>Information Design 3</em> is more branding than information design, group it accordingly.</p>
		<p>Free-roaming courses like <em>Materials and Methods</em> or <em>Design Workshop</em> might fall under any one of the below categories. And if you really feel like we're missing a category, <a href="https://www.facebook.com/messages/100007107395716">let us know</a>.</p>
		<div class="table">
			<div class="row" v-for="row in rows" :class="{ 'divider': row.isHeader }">
				<div class="category">{{ row.category }}</div>
				<div class="courses">
					<div class="course" v-for="course in row.courses">{{ course }}</div>
				</div>
			</div>
		</table>
	</div>
</template>

<script>

export default {
	name: 'CategoriesView',
	data () {
		return {
			rows: [
				{
					category: 'Communication',
					isHeader: true
				},
				{
					category: 'Graphic Design',
					courses: [
						'Corporate Identity (4007)',
						'Typography (2003, 2007)',
						'Packaging Design (3010, 4010)'
					]
				},
				{
					category: 'Branding',
					courses: [
						'Visual Language (1001)',
						'Design & Image (1002)',
						'Communication Design (2004, 3004)'
					]
				},
				{
					category: 'Type Design',
					courses: [
						'Typography (1005, 2003, 2007)',
						'Communication Design (2004, 3004)',
						'Typeface Design (3003)'
					]
				},
				{
					category: 'Book Design',
					courses: [
						'Editorial Design (3011)',
						'Book Design (4005)'
					]
				},
				{
					category: 'Editorial Design',
					courses: [
						'Communication Design (2004, 3004)',
						'Editorial Design (3011)'
					]
				},
				{
					category: 'Information',
					isHeader: true
				},
				{
					category: 'Information Design',
					courses: [
						'Information Design (2008, 3008, 4008)',
						'Typography for Information Design (3015)',
					]
				},
				{
					category: 'Data Visualization',
					courses: [
						'Information Design (3008, 4008)',
						'New Media Forms: The Database (DATT3935)'
					]
				},
				{
					category: 'Interactive & Motion',
					courses: '',
					isHeader: true
				},
				{
					category: 'Motion Design',
					courses: [
						'Type in Motion (4002)',
						'Advanced Topics in Interactivity (4003)'
					]
				},
				{
					category: 'Web Design',
					courses: [
						'Interactivity Design (1006, 2005, 3006)',
						'Design & Systems (3005)',
						'Advanced Topics in Interactivity (4003)',
						'Information Design 3 (3012)'
					]
				},
				{
					category: 'Mobile Design',
					courses: [
						'Interactivity Design (2005, 3006)',
						'Design & Systems (3005)',
						'Advanced Topics in Interactivity (4003)',
					]
				},
				{
					category: 'Physical Computing',
					courses: [
						'Design in Interactive Environments (4009)',
						'Physical Computing I & II (DATT2000, DATT2010)'
					]
				},
				{
					category: 'Digital Product Design',
					courses: [
						'Interactivity Design 3 (3006)',
						'Design & Systems (3005)',
						'Advanced Topics in Interactivity (4003)',
					]
				},
				{
					category: 'Physical',
					isHeader: true
				},
				{
					category: 'Experiential Design',
					courses: [
						'Environmental Graphic Design (3014)'
					]
				},
				{
					category: 'Service Design',
					courses: [
						'???'
					]
				},
				{
					category: 'Packaging Design',
					courses: [
						'3D Design (2010)',
						'Packaging Design (3010, 4010)'
					]
				},
				{
					category: 'Physical Product Design',
					courses: [
						'3D Design (2010)',
						'Packaging Design (3010, 4010)'
					]
				}
			]
		}
	}
}

</script>

<style scoped>

.categories {
	line-height: 1.5;
}

.categories a {
	color: #5ac2b4;
	border-bottom: 1px currentColor solid;
}

h2 {
	margin: 4rem 0;
	font-size: 48px;
	text-align: center;
}

.table {
	margin: 4rem 0 0;
	padding: 0 0 2rem;
}

.table header {
	display: flex;
	justify-content: flex-start;
	font-weight: bold;
}

.category {
	flex: 1 0 50%;
	font-weight: bold;
}

.row {
	display: flex;
	padding: 0.75rem 0;
}

.row .courses {
	flex: 1 0 50%;
	color: #777;
}

.row .courses .course {
	line-height: 1.3;
	margin-bottom: 0.25rem;
}

.divider {
	display: block;
	margin: 2rem 0 1rem;
	font-size: 1.4em;
	font-weight: bold;
}

.divider .category {
	border-bottom: 2px #cfcfcf solid;
	padding-bottom: 0.25em;
}

</style>
